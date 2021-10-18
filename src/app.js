import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import Youch from 'youch';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import routes from './routes';
import { error } from './app/services/responsePattern';

import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init({
      dns: sentryConfig.dsn,
      environment: sentryConfig.environment,
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app: this.server }),
      ],

      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,
    });

    this.middlewares();
    this.routes();

    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
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
    this.server.use(Sentry.Handlers.errorHandler());
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
