import { createApp } from './app';
import { env } from './config/env';
import { logger } from './lib/logger';
import { connectMongo, disconnectMongo } from './lib/mongo';
import { captureException, initSentry } from './lib/sentry';

async function bootstrap() {
  initSentry();
  await connectMongo();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`api_listening port=${env.PORT} env=${env.NODE_ENV}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`shutdown_initiated signal=${signal}`);
    server.close(async () => {
      await disconnectMongo();
      logger.info('shutdown_complete');
      process.exit(0);
    });
    setTimeout(() => {
      logger.error('shutdown_forced');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  captureException(err);
  logger.fatal({ err }, 'bootstrap_failed');
  process.exit(1);
});
