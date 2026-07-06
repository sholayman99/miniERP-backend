import type { Request, Response } from 'express'
import { asyncHandler } from '../../lib/async-handler'
import { ok } from '../../lib/response'
import { UnauthorizedError } from '../../lib/errors'
import * as authService from './auth.service'

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { token, user } = await authService.login(req.body)
  return ok(res, { user, token })
})

export const logoutHandler = asyncHandler(async (_req: Request, res: Response) => {
  return ok(res, { loggedOut: true })
})

export const meHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw new UnauthorizedError()
  const me = await authService.getMe(req.auth.userId, req.auth.role ?? '')
  return ok(res, me)
})
