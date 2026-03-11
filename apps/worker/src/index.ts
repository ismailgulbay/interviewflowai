import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { initSentry, Sentry } from './config/sentry.js';
import { closeConnections, initConnections } from './connections/index.js';
import { getRabbitChannel } from './connections/rabbitmq.js';
import { startEvaluationConsumer } from './consumer/evaluation.consumer.js';
import { MockEvaluationProvider } from './providers/mock-evaluation.provider.js';
import { EvaluationJobService } from './services/evaluation-job.service.js';

async function bootstrap(): Promise<void> {
  initSentry();
  await initConnections();

  const provider = new MockEvaluationProvider();
  const service = new EvaluationJobService(provider);
  const channel = getRabbitChannel();

  await startEvaluationConsumer(channel, service);

  logger.info(
    {
      queue: env.RABBITMQ_QUEUE,
      maxRetry: env.MAX_RETRY_COUNT,
      concurrency: env.WORKER_CONCURRENCY,
    },
    'Evaluation worker is running',
  );
}

async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, 'Worker shutdown requested');
  await closeConnections();
  logger.info('Worker shutdown complete');
}

process.on('SIGINT', () => {
  void shutdown('SIGINT').finally(() => process.exit(0));
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM').finally(() => process.exit(0));
});

bootstrap().catch(async (error) => {
  Sentry.captureException(error);
  logger.error({ err: error }, 'Worker bootstrap failed');
  await closeConnections();
  process.exit(1);
});
