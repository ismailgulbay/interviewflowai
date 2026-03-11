import { Router } from 'express';
import { z } from 'zod';

import { AppError } from '../../lib/app-error.js';
import { asyncHandler } from '../../lib/async-handler.js';
import { authorize } from '../../middleware/auth.js';
import { validateRequest } from '../../middleware/validate-request.js';

import { createSession, getInterviewById, listInterviews } from './interviews.store.js';

const interviewsRouter = Router();

const interviewParamsSchema = z.object({
  id: z.string().min(1),
});

interviewsRouter.get(
  '/',
  authorize(['admin', 'interviewer', 'candidate']),
  asyncHandler(async (_req, res) => {
    res.status(200).json({
      success: true,
      data: listInterviews(),
    });
  }),
);

interviewsRouter.get(
  '/:id',
  authorize(['admin', 'interviewer', 'candidate']),
  validateRequest({ params: interviewParamsSchema }),
  asyncHandler(async (req, res) => {
    const interviewId = String(req.params.id);
    const interview = getInterviewById(interviewId);
    if (!interview) {
      throw new AppError(404, 'NOT_FOUND', 'Interview not found');
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  }),
);

interviewsRouter.post(
  '/:id/start',
  authorize(['admin', 'interviewer', 'candidate']),
  validateRequest({ params: interviewParamsSchema }),
  asyncHandler(async (req, res) => {
    const interviewId = String(req.params.id);
    const interview = getInterviewById(interviewId);
    if (!interview) {
      throw new AppError(404, 'NOT_FOUND', 'Interview not found');
    }

    const candidateEmail = req.user?.email ?? 'candidate@interviewflow.ai';
    const session = createSession(interview.id, candidateEmail);

    res.status(201).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        interviewId: session.interviewId,
        status: session.status,
      },
    });
  }),
);

export { interviewsRouter };
