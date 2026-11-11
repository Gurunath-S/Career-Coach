import { Router } from 'express'
import { requestPresignedUrl, directUploadSimulation } from './uploads.controller'
import { authenticate, requireRole } from '../../middlewares/auth'
import { validateRequest } from '../../middlewares/validate'
import { presignedUrlRequestSchema } from '@careercatch/shared-types'

export const uploadsRouter = Router()

// Presigned URL generation (Admin only)
uploadsRouter.post(
  '/presigned-url',
  authenticate,
  requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  validateRequest(presignedUrlRequestSchema),
  requestPresignedUrl
)

// Dev/Local direct upload endpoint
uploadsRouter.put('/direct', directUploadSimulation)
