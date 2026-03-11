import { createServer } from 'node:http';

import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { initSentry } from './config/sentry.js';
import { closeConnections, initConnections } from './connections/index.js';

async function bootstrap() {
  initSentry();
  await initConnections();

  const app = createApp();
  const server = createServer(app);

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down API service');

    server.close(async () => {
      await closeConnections();
      logger.info('API service stopped gracefully');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT, prefix: env.API_PREFIX }, 'InterviewFlow API listening');
  });
}

bootstrap().catch((error) => {
  logger.error({ err: error }, 'Failed to bootstrap API');
  process.exit(1);
});
