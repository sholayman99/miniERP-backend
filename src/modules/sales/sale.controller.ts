import type { Request, Response } from 'express'
import { asyncHandler } from '../../lib/async-handler'
import { ok, created } from '../../lib/response'
import { UnauthorizedError } from '../../lib/errors'
import * as saleService from './sale.service'

export const createSaleHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw new UnauthorizedError()
  const sale = await saleService.createSale(req.body, req.auth.userId)
  return created(res, sale)
})

export const listSalesHandler = asyncHandler(async (req: Request, res: Response) => {
  const { items, meta } = await saleService.listSales(req.query)
  return ok(res, items, meta)
})

export const getSaleHandler = asyncHandler(async (req: Request, res: Response) => {
  const sale = await saleService.getSaleById(req.params.id)
  return ok(res, sale)
})
