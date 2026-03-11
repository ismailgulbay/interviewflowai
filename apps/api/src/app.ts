import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { Sentry } from './config/sentry.js';
import { buildOpenApiSpec } from './docs/openapi.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { httpLogger } from './middleware/http-logger.js';
import { healthRouter } from './modules/health/health.routes.js';
import { apiRouter } from './routes/api.routes.js';

export function createApp() {
  const app = express();

  app.use(httpLogger);
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/health', healthRouter);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(buildOpenApiSpec()));
  app.use(env.API_PREFIX, apiRouter);

  app.use(notFoundHandler);
  Sentry.setupExpressErrorHandler(app);
  app.use(errorHandler);

  return app;
}
