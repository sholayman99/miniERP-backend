import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import { validateBody } from '../../middleware/validate'
import { loginSchema } from './auth.validation'
import * as controller from './auth.controller'

const router = Router()

router.post('/login', validateBody(loginSchema), controller.loginHandler)
router.post('/logout', controller.logoutHandler)
router.get('/me', requireAuth(), controller.meHandler)

export default router
