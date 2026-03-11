import { Router } from 'express';

import { asyncHandler } from '../../lib/async-handler.js';
import { authorize } from '../../middleware/auth.js';

const questionsRouter = Router();

questionsRouter.get(
  '/',
  authorize(['admin', 'interviewer', 'candidate']),
  asyncHandler(async (_req, res) => {
    res.status(200).json({
      success: true,
      data: [{ id: 'q_1', category: 'algorithms', prompt: 'Explain binary search complexity.' }],
    });
  }),
);

export { questionsRouter };
