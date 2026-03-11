import pino from 'pino';

import { env } from './env.js';

export const logger = pino({
  name: 'interviewflow-worker',
  level: env.LOG_LEVEL,
});
