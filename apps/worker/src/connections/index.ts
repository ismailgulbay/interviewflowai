import { connectMongo, disconnectMongo } from './mongo.js';
import { connectRabbitMQ, disconnectRabbitMQ } from './rabbitmq.js';
import { connectRedis, disconnectRedis } from './redis.js';

export async function initConnections(): Promise<void> {
  await Promise.all([connectMongo(), connectRedis(), connectRabbitMQ()]);
}

export async function closeConnections(): Promise<void> {
  await Promise.allSettled([disconnectMongo(), disconnectRedis(), disconnectRabbitMQ()]);
}
