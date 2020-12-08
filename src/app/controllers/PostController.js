import Sequelize from 'sequelize';
import Post from '../models/Post';
import User from '../models/User';
import File from '../models/File';
import { success, error, pagination } from '../services/responsePattern';
import { reduceQualityFile } from '../services/resizeFile';

class PostController {
  async index(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const { count, rows: posts } = await Post.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      order: [['real_date', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json({ ...success(), posts, ...pagination(page, limit, count) });
  }

  async showRandom(req, res) {
    const image = await Post.findOne({
      attributes: ['id', 'name', 'url', 'path'],
      order: [Sequelize.literal('random()')],
    });

    return res.json({ ...success(), image });
  }

  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const { title, subtitle, real_date = new Date() } = req.body;
    const user_id = req.userId;
    if (!req.userIsAdmin) {
      return res.status(403).json({
        ...error('User does not have provileges to post.'),
      });
    }

    await reduceQualityFile(req.file.path, 50);

    try {
      const post = await Post.create({
        name,
        path,
        title,
        subtitle,
        real_date,
        user_id,
      });

      const postWithUser = await Post.findByPk(post.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['name', 'path', 'url'],
              },
            ],
          },
        ],
      });

      return res.json({ ...success(), post: postWithUser });
    } catch (err) {
      return res.status(500).json({ ...error() });
    }
  }
}

export default new PostController();
