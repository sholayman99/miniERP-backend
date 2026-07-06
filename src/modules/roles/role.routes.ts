import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import { requirePermission } from '../../middleware/require-permission'
import { validateBody } from '../../middleware/validate'
import { updateRolePermissionsSchema } from './role.validation'
import * as controller from './role.controller'

const router = Router()
router.use(requireAuth())
router.use(requirePermission('roles:manage'))

router.get('/', controller.listRolesHandler)
router.get('/:id', controller.getRoleHandler)
router.put('/:id/permissions', validateBody(updateRolePermissionsSchema), controller.updateRolePermissionsHandler)

export default router
