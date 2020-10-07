import Post from '../models/Post';
import User from '../models/User';
import File from '../models/File';
import { success, error, pagination } from '../services/responsePattern';

class PostController {
  async index(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const { count, rows: posts } = await Post.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']],
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

  async store(req, res) {
    // console.log(req);
    const { originalname: name, filename: path } = req.file;

    const { title, subtitle, real_date } = req.body;
    const user_id = req.userId;

    try {
      const post = await Post.create({
        name,
        path,
        title,
        subtitle,
        real_date,
        user_id,
      });
      return res.json({ ...success(), post });
    } catch (err) {
      return res.status(500).json({ ...error() });
    }
  }
}

export default new PostController();
