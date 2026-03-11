import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

import { AppError } from '../lib/app-error.js';

interface ValidateShape {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export function validateRequest(shape: ValidateShape) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const details: Array<{ path: string; message: string }> = [];

    if (shape.body) {
      const parsedBody = shape.body.safeParse(req.body);
      if (!parsedBody.success) {
        details.push(
          ...parsedBody.error.issues.map((issue) => ({
            path: `body.${issue.path.join('.')}`,
            message: issue.message,
          })),
        );
      } else {
        req.body = parsedBody.data;
      }
    }

    if (shape.query) {
      const parsedQuery = shape.query.safeParse(req.query);
      if (!parsedQuery.success) {
        details.push(
          ...parsedQuery.error.issues.map((issue) => ({
            path: `query.${issue.path.join('.')}`,
            message: issue.message,
          })),
        );
      } else {
        req.query = parsedQuery.data as Request['query'];
      }
    }

    if (shape.params) {
      const parsedParams = shape.params.safeParse(req.params);
      if (!parsedParams.success) {
        details.push(
          ...parsedParams.error.issues.map((issue) => ({
            path: `params.${issue.path.join('.')}`,
            message: issue.message,
          })),
        );
      } else {
        req.params = parsedParams.data as Request['params'];
      }
    }

    if (details.length > 0) {
      return next(new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', details));
    }

    return next();
  };
}
