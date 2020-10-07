import File from '../models/File';
import { success, error, pagination } from '../services/responsePattern';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });
    return res.json({ ...success(), file });
  }
}

export default new FileController();
