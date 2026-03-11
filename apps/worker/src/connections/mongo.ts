import mongoose from 'mongoose';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export async function connectMongo(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);
  logger.info('MongoDB connected');
}

export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}
