import type { Request, Response } from 'express'
import { asyncHandler } from '../../lib/async-handler'
import { ok } from '../../lib/response'
import { Permission } from './permission.model'

export const listPermissionsHandler = asyncHandler(async (_req: Request, res: Response) => {
  const permissions = await Permission.find().sort('module action')
  return ok(res, permissions)
})
