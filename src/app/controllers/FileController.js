import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import File from '../models/File';

import User from '../models/User';
import { success } from '../services/responsePattern';
import { resizeFile } from '../services/resizeFile';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: filePath, destination } = req.file;

    // try {
    //   const userHasAvatar = await User.findOne({
    //     where: { id: req.userId },
    //     include: [
    //       {
    //         model: File,
    //         as: 'avatar',
    //         attributes: ['id', 'path', 'url'],
    //       },
    //     ],
    //   });
    //   if (userHasAvatar.avatar) {
    //     fs.unlinkSync(`${destination}/${userHasAvatar.avatar.path}`);
    //     await File.destroy({ where: { id: userHasAvatar.avatar.id } });
    //   }
    // } catch (err) {
    //   console.error(err);
    // }

    await resizeFile(req.file.path, 300);

    const file = await File.create({
      name,
      path: filePath,
    });

    return res.json({ ...success(), file });
  }
}

export default new FileController();
