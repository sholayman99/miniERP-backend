import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import { requirePermission } from '../../middleware/require-permission'
import { validateBody, validateQuery } from '../../middleware/validate'
import { createSaleSchema, listSalesQuerySchema } from './sale.validation'
import * as controller from './sale.controller'

const router = Router()
router.use(requireAuth())

router.get('/', requirePermission('sales:read'), validateQuery(listSalesQuerySchema), controller.listSalesHandler)
router.get('/:id', requirePermission('sales:read'), controller.getSaleHandler)
router.post('/', requirePermission('sales:create'), validateBody(createSaleSchema), controller.createSaleHandler)

export default router
