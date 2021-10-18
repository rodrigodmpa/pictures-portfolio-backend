import Sequelize from 'sequelize';
import Post from '../models/Post';
import User from '../models/User';
import File from '../models/File';
import Like from '../models/Like';
import { success, error, pagination } from '../services/responsePattern';
import { reduceQualityFile } from '../services/resizeFile';
import deleteFile from '../services/deleteFile';

class PostController {
  async index(req, res) {
    const { page = 1, limit = 10 } = req.query;
    // const user_id = req.userId;
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
        {
          model: Like,
          as: 'likes',
          attributes: ['id', 'user_id', 'post_id'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    // const postsWithLiked = posts.map((post) => ({
    //   ...post,
    //   isLiked: !!post?.likes?.filter((like) => like.user_id === user_id),
    // }));
    // console.log(postsWithLiked);
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

  async update(req, res) {
    const { post_id } = req.params;
    const { title, subtitle, real_date } = req.body;

    if (!req.userIsAdmin)
      return res
        .status(403)
        .json({ ...error('User does not have permission to edit posts.') });
    try {
      const postExists = await Post.findByPk(post_id);
      if (postExists.user_id !== req.userId)
        return res.status(403).json({
          ...error('You can not edit posts from another user.'),
        });
      const [numberOfPostsUpdated, post] = await Post.update(
        { title, subtitle, real_date },
        {
          where: { id: post_id },
          returning: true,
        }
      );
      return res.json({ ...success(), numberOfPostsUpdated, post });
    } catch (err) {
      return res.status(500).json({ ...error() });
    }
  }

  async delete(req, res) {
    const { post_id } = req.params;
    if (!req.userIsAdmin)
      return res
        .status(403)
        .json({ ...error('User does not have permission to delete posts.') });
    try {
      const post = await Post.findByPk(post_id);
      if (post.user_id !== req.userId)
        return res.status(403).json({
          ...error('You can not delete posts from another user.'),
        });
      await Post.destroy({ where: { id: post_id } });
      deleteFile({
        pathStartingWithTmp: ['tmp', 'uploads', 'posts', post.path],
      });
      return res.json({ ...success() });
    } catch (err) {
      return res.status(500).json({ ...error() });
    }
  }

  async show(req, res) {
    const { post_id } = req.params;
    try {
      const post = await Post.findByPk(post_id, {
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
      return res.json({ ...success(), post });
    } catch (err) {
      return res.status(500).json({ ...error() });
    }
  }
}

export default new PostController();
