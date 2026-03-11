import { Router } from 'express';
import { z } from 'zod';

import { AppError } from '../../lib/app-error.js';
import { asyncHandler } from '../../lib/async-handler.js';
import { authorize } from '../../middleware/auth.js';
import { validateRequest } from '../../middleware/validate-request.js';

import { getInterviewById, getSessionById, saveAnswer, submitSession } from './interviews.store.js';

const sessionsRouter = Router();

const sessionParamsSchema = z.object({
  sessionId: z.string().min(1),
});

const answerBodySchema = z.object({
  questionId: z.string().min(1),
  answer: z.string().min(1),
});

sessionsRouter.get(
  '/:sessionId',
  authorize(['admin', 'interviewer', 'candidate']),
  validateRequest({ params: sessionParamsSchema }),
  asyncHandler(async (req, res) => {
    const sessionId = String(req.params.sessionId);
    const session = getSessionById(sessionId);
    if (!session) {
      throw new AppError(404, 'NOT_FOUND', 'Session not found');
    }

    const interview = getInterviewById(session.interviewId);
    if (!interview) {
      throw new AppError(404, 'NOT_FOUND', 'Interview not found');
    }

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        interviewId: session.interviewId,
        status: session.status,
        questions: interview.questions,
        answers: session.answers,
      },
    });
  }),
);

sessionsRouter.post(
  '/:sessionId/answers',
  authorize(['admin', 'interviewer', 'candidate']),
  validateRequest({ params: sessionParamsSchema, body: answerBodySchema }),
  asyncHandler(async (req, res) => {
    const sessionId = String(req.params.sessionId);
    const session = saveAnswer(sessionId, req.body.questionId, req.body.answer);
    if (!session) {
      throw new AppError(404, 'NOT_FOUND', 'Session not found');
    }

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        status: session.status,
        answersCount: Object.keys(session.answers).length,
      },
    });
  }),
);

sessionsRouter.post(
  '/:sessionId/submit',
  authorize(['admin', 'interviewer', 'candidate']),
  validateRequest({ params: sessionParamsSchema }),
  asyncHandler(async (req, res) => {
    const sessionId = String(req.params.sessionId);
    const session = submitSession(sessionId);
    if (!session) {
      throw new AppError(404, 'NOT_FOUND', 'Session not found');
    }

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        status: session.status,
      },
    });
  }),
);

sessionsRouter.get(
  '/:sessionId/status',
  authorize(['admin', 'interviewer', 'candidate']),
  validateRequest({ params: sessionParamsSchema }),
  asyncHandler(async (req, res) => {
    const sessionId = String(req.params.sessionId);
    const session = getSessionById(sessionId);
    if (!session) {
      throw new AppError(404, 'NOT_FOUND', 'Session not found');
    }

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        status: session.status,
      },
    });
  }),
);

sessionsRouter.get(
  '/:sessionId/result',
  authorize(['admin', 'interviewer', 'candidate']),
  validateRequest({ params: sessionParamsSchema }),
  asyncHandler(async (req, res) => {
    const sessionId = String(req.params.sessionId);
    const session = getSessionById(sessionId);
    if (!session) {
      throw new AppError(404, 'NOT_FOUND', 'Session not found');
    }

    if (session.status !== 'completed' || !session.result) {
      throw new AppError(409, 'RESULT_NOT_READY', 'Evaluation result is not ready yet');
    }

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        status: session.status,
        ...session.result,
      },
    });
  }),
);

export { sessionsRouter };
