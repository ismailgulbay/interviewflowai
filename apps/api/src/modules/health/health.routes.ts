import { Router } from 'express';

import { connectionHealth } from '../../connections/index.js';
import { asyncHandler } from '../../lib/async-handler.js';

const healthRouter = Router();

healthRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const dependencies = connectionHealth();
    const healthy = Object.values(dependencies).every(Boolean);

    res.status(healthy ? 200 : 503).json({
      success: healthy,
      service: 'api',
      dependencies,
      timestamp: new Date().toISOString(),
    });
  }),
);

export { healthRouter };
