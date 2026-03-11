import { Router } from 'express';

import { asyncHandler } from '../../lib/async-handler.js';
import { authorize } from '../../middleware/auth.js';

const usersRouter = Router();

usersRouter.get(
  '/',
  authorize(['admin']),
  asyncHandler(async (_req, res) => {
    res.status(200).json({
      success: true,
      data: [
        { id: 'u_1', email: 'admin@interviewflow.ai', role: 'admin' },
        { id: 'u_2', email: 'candidate@interviewflow.ai', role: 'candidate' },
      ],
    });
  }),
);

export { usersRouter };
