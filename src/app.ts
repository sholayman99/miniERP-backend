import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './lib/logger';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';
import { requestId } from './middleware/request-id';
import { healthRouter } from './modules/health/health.routes';
import apiRouter from './routes';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet());

  const allowedOrigins = [env.ADMIN_URL, 'http://localhost:5174'];
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());
  app.use(requestId);
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => (req as { id?: string }).id ?? 'unknown',
      customProps: (req) => ({ reqId: (req as { id?: string }).id }),
    })
  );

  app.use('/api/v1/health', healthRouter);

  app.use('/api/v1', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
