import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { getRedisClient } from '../connections/redis.js';
import { EvaluationRecordModel } from '../models/evaluation-record.model.js';
import type { MockEvaluationProvider } from '../providers/mock-evaluation.provider.js';
import type { EvaluationJobPayload } from '../types/evaluation-job.js';

const STATUS_KEY_PREFIX = 'evaluation:job:status';

interface ProcessContext {
  payload: EvaluationJobPayload;
  attempt: number;
}

export interface ProcessResult {
  action: 'ack' | 'retry';
  nextAttempt?: number;
}

export class EvaluationJobService {
  constructor(private readonly provider: MockEvaluationProvider) {}

  async process(ctx: ProcessContext): Promise<ProcessResult> {
    const { payload, attempt } = ctx;

    await this.writeStatus(payload.jobId, 'running', attempt);
    logger.info({ jobId: payload.jobId, attempt }, 'Evaluation job started');

    try {
      const result = await this.provider.evaluate(payload);

      await EvaluationRecordModel.updateOne(
        { jobId: payload.jobId },
        {
          $set: {
            jobId: payload.jobId,
            interviewId: payload.interviewId,
            candidateId: payload.candidateId,
            status: 'completed',
            attempt,
            score: result.score,
            summary: result.summary,
            strengths: result.strengths,
            improvements: result.improvements,
            processedAt: new Date(),
            errorMessage: null,
          },
        },
        { upsert: true },
      );

      await this.writeStatus(payload.jobId, 'completed', attempt, {
        score: result.score,
      });

      logger.info(
        {
          jobId: payload.jobId,
          attempt,
          score: result.score,
        },
        'Evaluation job completed',
      );

      return { action: 'ack' };
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : 'Unknown evaluation error';
      const canRetry = attempt < env.MAX_RETRY_COUNT;

      if (!canRetry) {
        await EvaluationRecordModel.updateOne(
          { jobId: payload.jobId },
          {
            $set: {
              jobId: payload.jobId,
              interviewId: payload.interviewId,
              candidateId: payload.candidateId,
              status: 'failed',
              attempt,
              processedAt: new Date(),
              errorMessage: errMessage,
            },
          },
          { upsert: true },
        );

        await this.writeStatus(payload.jobId, 'failed', attempt, {
          error: errMessage,
        });

        logger.error({ jobId: payload.jobId, attempt, err: error }, 'Evaluation job failed permanently');
        return { action: 'ack' };
      }

      const nextAttempt = attempt + 1;
      await this.writeStatus(payload.jobId, 'retrying', attempt, {
        nextAttempt,
        reason: errMessage,
      });

      logger.warn(
        { jobId: payload.jobId, attempt, nextAttempt, err: error },
        'Evaluation job failed, retry scheduled',
      );

      return {
        action: 'retry',
        nextAttempt,
      };
    }
  }

  private async writeStatus(
    jobId: string,
    status: 'running' | 'completed' | 'failed' | 'retrying',
    attempt: number,
    extra?: Record<string, unknown>,
  ): Promise<void> {
    const redis = getRedisClient();
    const key = `${STATUS_KEY_PREFIX}:${jobId}`;
    const value = {
      status,
      attempt,
      updatedAt: new Date().toISOString(),
      ...extra,
    };

    await redis.set(key, JSON.stringify(value), 'EX', env.STATUS_TTL_SECONDS);
  }
}
