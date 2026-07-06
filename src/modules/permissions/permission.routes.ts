import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import { requirePermission } from '../../middleware/require-permission'
import { listPermissionsHandler } from './permission.controller'

const router = Router()
router.use(requireAuth())
router.get('/', requirePermission('roles:manage'), listPermissionsHandler)

export default router
