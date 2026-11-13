import { Router } from 'express'
import {
  submitDemoRequest,
  listDemoRequests,
  updateDemoStatus,
} from './demos.controller'
import { authenticate, requireRole } from '../../middlewares/auth'
import { validateRequest } from '../../middlewares/validate'
import { demoRequestSchema, demoRequestStatusUpdateSchema } from '@careercatch/shared-types'

export const demosRouter = Router()

// Public submission
demosRouter.post('/', validateRequest(demoRequestSchema), submitDemoRequest)

// Admin management
demosRouter.get('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), listDemoRequests)
demosRouter.patch('/:id/status', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), validateRequest(demoRequestStatusUpdateSchema), updateDemoStatus)
