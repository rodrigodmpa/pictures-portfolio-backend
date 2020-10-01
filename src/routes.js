import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.put('/users', authMiddleware, UserController.update);
routes.post('/sessions', SessionController.store);

routes.get('/', async (req, res) => {
  return res.json({ status: 'ok' });
});

export default routes;
