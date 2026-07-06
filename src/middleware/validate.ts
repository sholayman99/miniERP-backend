import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'
import { BadRequestError } from '../lib/errors'

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return next(new BadRequestError('Validation failed', result.error.flatten()))
    }
    req.body = result.data
    next()
  }
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return next(new BadRequestError('Invalid query params', result.error.flatten()))
    }
    // req.query is read-only in newer Express types — cast to assign safely.
    Object.assign(req.query, result.data)
    next()
  }
}
