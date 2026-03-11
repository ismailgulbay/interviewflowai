import amqp, { type Channel, type ChannelModel, type ConsumeMessage } from 'amqplib';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export async function connectRabbitMQ(): Promise<Channel> {
  if (channel) {
    return channel;
  }

  const channelModel = await amqp.connect(env.RABBITMQ_URL);
  const rabbitChannel = await channelModel.createChannel();

  await rabbitChannel.assertQueue(env.RABBITMQ_QUEUE, { durable: true });
  await rabbitChannel.prefetch(env.RABBITMQ_PREFETCH);

  channelModel.on('error', (error: unknown) => {
    logger.error({ err: error }, 'RabbitMQ connection error');
  });

  channelModel.on('close', () => {
    logger.warn('RabbitMQ connection closed');
    connection = null;
    channel = null;
  });

  connection = channelModel;
  channel = rabbitChannel;
  logger.info({ queue: env.RABBITMQ_QUEUE }, 'RabbitMQ connected');
  return rabbitChannel;
}

export function getRabbitChannel(): Channel {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
}

export function parseMessage<T>(message: ConsumeMessage): T {
  return JSON.parse(message.content.toString('utf8')) as T;
}

export async function disconnectRabbitMQ(): Promise<void> {
  if (!channel || !connection) {
    return;
  }
  await channel.close();
  await connection.close();
  channel = null;
  connection = null;
  logger.info('RabbitMQ disconnected');
}
