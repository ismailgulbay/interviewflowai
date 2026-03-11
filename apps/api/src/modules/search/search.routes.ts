import { Router } from 'express';
import { z } from 'zod';

import { getElasticsearchClient } from '../../connections/elasticsearch.js';
import { asyncHandler } from '../../lib/async-handler.js';
import { authorize } from '../../middleware/auth.js';
import { validateRequest } from '../../middleware/validate-request.js';

const searchRouter = Router();

const searchQuerySchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

searchRouter.get(
  '/',
  authorize(['admin', 'interviewer', 'candidate']),
  validateRequest({ query: searchQuerySchema }),
  asyncHandler(async (req, res) => {
    const client = getElasticsearchClient();

    res.status(200).json({
      success: true,
      data: {
        query: req.query.q,
        limit: req.query.limit,
        engine: 'elasticsearch',
        connected: Boolean(client),
        hits: [],
      },
    });
  }),
);

export { searchRouter };
