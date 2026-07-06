import type { Request, Response } from 'express'
import { fail } from '../lib/response'

export function notFoundHandler(req: Request, res: Response) {
  return fail(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`)
}
