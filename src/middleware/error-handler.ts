import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import { AppError } from '../lib/errors';
import { captureException } from '../lib/sentry';
import { logger } from '../lib/logger';
import { fail } from '../lib/response';
import { isProd } from '../config/env';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return fail(
      res,
      400,
      'VALIDATION_ERROR',
      'Validation failed',
      err.flatten()
    );
  }

  if (err instanceof AppError) {
    return fail(res, err.status, err.code, err.message, err.details);
  }

  // Malformed ObjectId (e.g. GET /products/:id with a bad id) → 400, not 500.
  if (err instanceof Error && err.name === 'CastError') {
    return fail(res, 400, 'BAD_REQUEST', 'Invalid identifier');
  }

  // Unique-index violation (SKU / email race) → 409, not 500.
  if (
    typeof err === 'object' &&
    err !== null &&
    (err as { code?: number }).code === 11000
  ) {
    return fail(
      res,
      409,
      'CONFLICT',
      'A record with these details already exists'
    );
  }

  // File-upload errors (size limit, unexpected field) → 400, not 500.
  if (err instanceof MulterError) {
    return fail(res, 400, 'BAD_REQUEST', err.message);
  }

  captureException(err);
  logger.error({ err }, 'unhandled_error');

  return fail(
    res,
    500,
    'INTERNAL_ERROR',
    isProd ? 'Internal server error' : (err as Error).message
  );
}
