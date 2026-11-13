import { Router } from 'express'
import {
  listLearningPaths,
  getLearningPath,
  createLearningPath,
} from './learningPaths.controller'
import { authenticate, requireRole } from '../../middlewares/auth'
import { validateRequest } from '../../middlewares/validate'
import { learningPathSchema } from '@careercatch/shared-types'

export const learningPathsRouter = Router()

// Public routes
learningPathsRouter.get('/', listLearningPaths)
learningPathsRouter.get('/:idOrSlug', getLearningPath)

// Protected Admin route
learningPathsRouter.post('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), validateRequest(learningPathSchema), createLearningPath)
