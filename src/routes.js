import { Router } from 'express';

import uploadImageMiddleware from './app/middlewares/uploadAvatar';
import uploadPostMiddleware from './app/middlewares/uploadPost';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import PostController from './app/controllers/PostController';

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

routes.post(
  '/posts',
  authMiddleware,
  uploadPostMiddleware.single('file'),
  PostController.store
);

routes.get('/posts', authMiddleware, PostController.index);
routes.get('/posts/:post_id', authMiddleware, PostController.show);
routes.put('/posts/:post_id', authMiddleware, PostController.update);
routes.delete('/posts/:post_id', authMiddleware, PostController.delete);

routes.get('/random-post', PostController.showRandom);

routes.get('/', async (req, res) => {
  return res.json({ status: 'ok' });
});

export default routes;
