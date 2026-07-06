import { Router } from 'express'
import { asyncHandler } from '../../lib/async-handler'
import { healthController } from './health.controller'

const router = Router()

router.get('/', asyncHandler(healthController.shallow))
router.get('/deep', asyncHandler(healthController.deep))

export const healthRouter = router
