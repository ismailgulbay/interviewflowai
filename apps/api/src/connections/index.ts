import {
  connectElasticsearch,
  disconnectElasticsearch,
  isElasticsearchHealthy,
} from './elasticsearch.js';
import { connectMongo, disconnectMongo, isMongoHealthy } from './mongo.js';
import { connectRabbitMQ, disconnectRabbitMQ, isRabbitMQHealthy } from './rabbitmq.js';
import { connectRedis, disconnectRedis, isRedisHealthy } from './redis.js';

export async function initConnections(): Promise<void> {
  await Promise.all([connectMongo(), connectRedis(), connectRabbitMQ(), connectElasticsearch()]);
}

export async function closeConnections(): Promise<void> {
  await Promise.allSettled([
    disconnectMongo(),
    disconnectRedis(),
    disconnectRabbitMQ(),
    disconnectElasticsearch(),
  ]);
}

export function connectionHealth() {
  return {
    mongo: isMongoHealthy(),
    redis: isRedisHealthy(),
    rabbitmq: isRabbitMQHealthy(),
    elasticsearch: isElasticsearchHealthy(),
  };
}
