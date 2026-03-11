import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
  WORKER_CONCURRENCY: z.coerce.number().int().min(1).max(50).default(5),
  RABBITMQ_URL: z.string().min(1),
  RABBITMQ_QUEUE: z.string().min(1).default('evaluation.jobs'),
  RABBITMQ_PREFETCH: z.coerce.number().int().min(1).max(100).default(5),
  MAX_RETRY_COUNT: z.coerce.number().int().min(0).max(10).default(3),
  RETRY_BACKOFF_MS: z.coerce.number().int().min(500).max(60_000).default(2000),
  STATUS_TTL_SECONDS: z.coerce.number().int().min(60).default(86_400),
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),
  SENTRY_DSN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const detail = parsed.error.issues.map((x) => `${x.path.join('.')}: ${x.message}`).join('; ');
  throw new Error(`Invalid environment: ${detail}`);
}

export const env = parsed.data;
