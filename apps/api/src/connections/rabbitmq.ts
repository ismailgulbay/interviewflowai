import amqp, { type Channel, type ChannelModel } from 'amqplib';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

let rabbitConnection: ChannelModel | null = null;
let rabbitChannel: Channel | null = null;

export async function connectRabbitMQ(): Promise<void> {
  if (rabbitConnection && rabbitChannel) {
    return;
  }

  const connection = await amqp.connect(env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(env.RABBITMQ_EXCHANGE, 'topic', {
    durable: true,
  });

  connection.on('error', (error: unknown) => {
    logger.error({ err: error }, 'RabbitMQ connection error');
  });

  connection.on('close', () => {
    logger.warn('RabbitMQ connection closed');
    rabbitConnection = null;
    rabbitChannel = null;
  });

  rabbitConnection = connection;
  rabbitChannel = channel;
  logger.info('RabbitMQ connected');
}

export async function publishEvent(
  routingKey: string,
  payload: Record<string, unknown>,
): Promise<void> {
  if (!rabbitChannel) {
    throw new Error('RabbitMQ channel has not been initialized');
  }

  rabbitChannel.publish(
    env.RABBITMQ_EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(payload)),
    {
      contentType: 'application/json',
      persistent: true,
      timestamp: Date.now(),
    },
  );
}

export async function disconnectRabbitMQ(): Promise<void> {
  if (!rabbitChannel || !rabbitConnection) {
    return;
  }

  await rabbitChannel.close();
  await rabbitConnection.close();
  rabbitChannel = null;
  rabbitConnection = null;
  logger.info('RabbitMQ disconnected');
}

export function isRabbitMQHealthy(): boolean {
  return rabbitConnection !== null && rabbitChannel !== null;
}
