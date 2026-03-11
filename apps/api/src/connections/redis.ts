import * as IORedis from 'ioredis';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

type RedisClient = InstanceType<typeof IORedis.Redis>;

let redisClient: RedisClient | null = null;

export async function connectRedis(): Promise<RedisClient> {
  if (redisClient) {
    return redisClient;
  }

  const client = new IORedis.Redis(env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 2,
  });

  client.on('error', (error: unknown) => {
    logger.error({ err: error }, 'Redis error');
  });

  await client.connect();
  redisClient = client;
  logger.info('Redis connected');
  return client;
}

export async function disconnectRedis(): Promise<void> {
  if (!redisClient) {
    return;
  }
  await redisClient.quit();
  redisClient = null;
  logger.info('Redis disconnected');
}

export function isRedisHealthy(): boolean {
  return redisClient?.status === 'ready';
}
