import type { Request, Response } from 'express'
import { asyncHandler } from '../../lib/async-handler'
import { ok } from '../../lib/response'
import * as dashboardService from './dashboard.service'

export const getDashboardStatsHandler = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await dashboardService.getDashboardStats()
  return ok(res, stats)
})
