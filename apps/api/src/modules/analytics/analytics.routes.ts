import { Router } from 'express';

import { asyncHandler } from '../../lib/async-handler.js';
import { authorize } from '../../middleware/auth.js';

const analyticsRouter = Router();

analyticsRouter.get(
  '/overview',
  authorize(['admin', 'interviewer']),
  asyncHandler(async (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        totalInterviews: 12,
        averageScore: 78,
        completionRate: 0.86,
      },
    });
  }),
);

export { analyticsRouter };
