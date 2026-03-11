import type { Channel, ConsumeMessage } from 'amqplib';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { Sentry } from '../config/sentry.js';
import { parseMessage } from '../connections/rabbitmq.js';
import type { EvaluationJobService } from '../services/evaluation-job.service.js';
import type { EvaluationJobPayload } from '../types/evaluation-job.js';

function readAttempt(message: ConsumeMessage): number {
  const headerAttempt = message.properties.headers?.attempt;
  if (typeof headerAttempt !== 'number' || Number.isNaN(headerAttempt)) {
    return 0;
  }
  return Math.max(0, Math.floor(headerAttempt));
}

function assertPayload(payload: EvaluationJobPayload): void {
  if (
    !payload.jobId ||
    !payload.interviewId ||
    !payload.candidateId ||
    !Array.isArray(payload.questionIds) ||
    !payload.transcript
  ) {
    throw new Error('Invalid evaluation job payload');
  }
}

function retryDelay(attempt: number): number {
  return env.RETRY_BACKOFF_MS * Math.max(1, attempt);
}

export async function startEvaluationConsumer(
  channel: Channel,
  service: EvaluationJobService,
): Promise<void> {
  await channel.consume(
    env.RABBITMQ_QUEUE,
    async (message) => {
      if (!message) {
        return;
      }

      try {
        const payload = parseMessage<EvaluationJobPayload>(message);
        assertPayload(payload);

        const attempt = readAttempt(message);
        const result = await service.process({ payload, attempt });

        if (result.action === 'ack') {
          channel.ack(message);
          return;
        }

        const nextAttempt = result.nextAttempt ?? attempt + 1;
        const delayMs = retryDelay(nextAttempt);

        channel.sendToQueue(env.RABBITMQ_QUEUE, Buffer.from(JSON.stringify(payload)), {
          persistent: true,
          contentType: 'application/json',
          expiration: delayMs.toString(),
          headers: {
            attempt: nextAttempt,
          },
        });

        logger.info(
          { jobId: payload.jobId, attempt, nextAttempt, delayMs },
          'Evaluation job requeued',
        );
        channel.ack(message);
      } catch (error) {
        Sentry.captureException(error);
        logger.error({ err: error }, 'Consumer message handling failed');
        channel.ack(message);
      }
    },
    {
      noAck: false,
      consumerTag: 'evaluation-consumer',
    },
  );

  logger.info(
    {
      queue: env.RABBITMQ_QUEUE,
      prefetch: env.RABBITMQ_PREFETCH,
    },
    'Evaluation consumer started',
  );
}
