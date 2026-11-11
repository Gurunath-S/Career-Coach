import { Router } from 'express'
import { listCategories, createCategory } from './categories.controller'
import { authenticate, requireRole } from '../../middlewares/auth'
import { validateRequest } from '../../middlewares/validate'
import { eventCategorySchema } from '@careercatch/shared-types'

export const categoriesRouter = Router()

categoriesRouter.get('/', listCategories)
categoriesRouter.post('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), validateRequest(eventCategorySchema), createCategory)
