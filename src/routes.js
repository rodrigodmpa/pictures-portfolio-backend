import { Router } from 'express';

import uploadImageMiddleware from './app/middlewares/image';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

const routes = new Router();

routes.get('/users', authMiddleware, UserController.index);
routes.post('/users', UserController.store);
routes.put('/users', authMiddleware, UserController.update);
routes.post('/sessions', SessionController.store);

routes.post(
  '/files',
  authMiddleware,
  uploadImageMiddleware.single('file'),
  FileController.store
);

routes.get('/', async (req, res) => {
  return res.json({ status: 'ok' });
});

export default routes;
