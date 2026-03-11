import { Router } from 'express';

import { asyncHandler } from '../../lib/async-handler.js';
import { authenticate } from '../../middleware/auth.js';
import { validateRequest } from '../../middleware/validate-request.js';

import { loginSchema } from './auth.schemas.js';
import { signLoginToken } from './auth.service.js';

const authRouter = Router();

authRouter.post(
  '/login',
  validateRequest({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    const token = signLoginToken(req.body);

    res.status(200).json({
      success: true,
      data: {
        token,
        tokenType: 'Bearer',
        expiresIn: '1h',
        user: {
          email: req.body.email,
          role: req.body.role,
        },
      },
    });
  }),
);

authRouter.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        email: req.user.email,
        role: req.user.role,
      },
    });
  }),
);

export { authRouter };
