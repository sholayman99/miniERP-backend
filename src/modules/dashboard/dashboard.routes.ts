import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import { requirePermission } from '../../middleware/require-permission'
import { getDashboardStatsHandler } from './dashboard.controller'

const router = Router()
router.use(requireAuth())

router.get('/', requirePermission('dashboard:read'), getDashboardStatsHandler)

export default router
