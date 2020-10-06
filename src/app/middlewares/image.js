import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype.includes('image/gif') ||
    file.mimetype.includes('image/jpeg') ||
    file.mimetype.includes('image/png') ||
    file.mimetype.includes('image/svg+xml')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Formatos de arquivos aceitos: png, gif, jpeg e svg.'), false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 2,
};

const storage = multer.diskStorage({
  destination: resolve(
    __dirname,
    '..',
    '..',
    '..',
    'tmp',
    'uploads',
    'avatars'
  ),
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, res) => {
      if (err) return cb(new Error(err));

      return cb(null, res.toString('hex') + extname(file.originalname));
    });
  },
});

const uploadDocument = multer({ storage, fileFilter: imageFilter, limits });
export default uploadDocument;
