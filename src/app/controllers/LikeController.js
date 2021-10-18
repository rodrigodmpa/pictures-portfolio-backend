import * as Yup from 'yup';

import Like from '../models/Like';
import { success, error, pagination } from '../services/responsePattern';

class LikeController {
  async index(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const { count, rows: likes } = await Like.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
    });

    return res.json({ ...success(), likes, ...pagination(page, limit, count) });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      post_id: Yup.string().required(),
    });
    if (!(await schema.isValid(req.query))) {
      return res.status(400).json({ ...error('Validation fails') });
    }

    const { post_id } = req.query;
    const user_id = req.userId;

    try {
      await Like.create({
        post_id,
        user_id,
      });

      return res.json({ ...success() });
    } catch (err) {
      return res.status(500).json({ ...error() });
    }
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      post_id: Yup.string().required(),
    });
    if (!(await schema.isValid(req.query))) {
      return res.status(400).json({ ...error('Validation fails') });
    }

    const { post_id } = req.query;
    const user_id = req.userId;

    try {
      const post = await Like.findOne({
        where: { post_id, user_id },
      });
      if (!post)
        return res.status(403).json({
          ...error('Something wrong happened...'),
        });
      await Like.destroy({ where: { post_id, user_id } });
      return res.json({ ...success() });
    } catch (err) {
      return res.status(500).json({ ...error() });
    }
  }
}

export default new LikeController();
