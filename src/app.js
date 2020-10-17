import 'dotenv/config';
import express from 'express';
import * as Youch from 'youch';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import routes from './routes';
import { error } from './app/services/responsePattern';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(helmet());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads', 'avatars'))
    );
    this.server.use(
      '/post_img',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads', 'posts'))
    );
  }

  routes() {
    this.server.use(routes);
    // this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }
      return res.status(500).json({ ...error() });
    });
  }
}

export default new App().server;
