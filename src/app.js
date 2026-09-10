import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { env } from './config/env.js';
import { logger } from './config/logger.js';
import routes from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimit.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      // Images from this API are embedded by the website on another origin.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.use(
    cors({
      origin(origin, cb) {
        // No Origin header: server-to-server, curl, same-origin.
        if (!origin) return cb(null, true);

        // CORS_ORIGINS=* means "any origin". We reflect the caller's origin
        // rather than sending a literal "*", because browsers refuse a wildcard
        // on credentialed requests — and the admin panel sends its refresh
        // cookie with every call.
        if (env.allowAllOrigins) return cb(null, true);

        if (env.corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true,
    }),
  );

  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  if (!env.isProd) {
    app.use(morgan('dev', { stream: { write: (msg) => logger.debug(msg.trim()) } }));
  }

  app.use('/uploads', express.static(path.resolve('uploads'), { maxAge: '7d' }));

  app.use('/api/v1', generalLimiter, routes);

  app.get('/', (_req, res) =>
    res.json({ success: true, name: 'GIA Educare API', version: 'v1', docs: '/api/v1/health' }),
  );

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
