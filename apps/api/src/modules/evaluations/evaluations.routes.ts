import { Router } from 'express';

import { asyncHandler } from '../../lib/async-handler.js';
import { authorize } from '../../middleware/auth.js';

const evaluationsRouter = Router();

evaluationsRouter.get(
  '/',
  authorize(['admin', 'interviewer']),
  asyncHandler(async (_req, res) => {
    res.status(200).json({
      success: true,
      data: [{ id: 'ev_1', interviewId: 'int_1', score: 84, rubric: 'technical-depth' }],
    });
  }),
);

export { evaluationsRouter };
