import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import { requirePermission } from '../../middleware/require-permission'
import { validateBody } from '../../middleware/validate'
import { createUserSchema, setUserActiveSchema } from './user.validation'
import * as controller from './user.controller'

const router = Router()
router.use(requireAuth())
router.use(requirePermission('users:manage'))

router.get('/', controller.listUsersHandler)
router.post('/', validateBody(createUserSchema), controller.createUserHandler)
router.patch('/:id/active', validateBody(setUserActiveSchema), controller.setUserActiveHandler)

export default router
