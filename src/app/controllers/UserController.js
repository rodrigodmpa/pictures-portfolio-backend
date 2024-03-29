import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';
import { success, error, pagination } from '../services/responsePattern';

class UserController {
  async index(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const { count, rows: users } = await User.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
    });

    return res.json({ ...success(), users, ...pagination(page, limit, count) });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ ...error('Validation fails') });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ ...error('User already exists') });
    }
    const { id, name, email, admin } = await User.create(req.body);

    return res.json({ ...success(), id, name, email, admin });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ ...error('Validation fails') });
    }
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ ...error('Email already exists') });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ ...error('Password does not match') });
    }

    await user.update(req.body);

    const { id, name, admin, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({ ...success(), id, name, email, admin, avatar });
  }
}

export default new UserController();
