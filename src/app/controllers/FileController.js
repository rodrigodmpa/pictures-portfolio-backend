import File from '../models/File';

import { success } from '../services/responsePattern';
import { resizeFile } from '../services/resizeFile';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: filePath } = req.file;

    await resizeFile(req.file.path, 300);

    const file = await File.create({
      name,
      path: filePath,
    });

    return res.json({ ...success(), file });
  }
}

export default new FileController();
