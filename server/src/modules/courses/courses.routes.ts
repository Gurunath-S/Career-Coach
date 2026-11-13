import { Router } from 'express'
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCoursePublish,
} from './courses.controller'
import { authenticate, requireRole } from '../../middlewares/auth'
import { validateRequest } from '../../middlewares/validate'
import { courseSchema } from '@careercatch/shared-types'

export const coursesRouter = Router()

// Public routes
coursesRouter.get('/', listCourses)
coursesRouter.get('/:idOrSlug', getCourse)

// Protected Admin routes
coursesRouter.post('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), validateRequest(courseSchema), createCourse)
coursesRouter.put('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), validateRequest(courseSchema), updateCourse)
coursesRouter.delete('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), deleteCourse)
coursesRouter.patch('/:id/publish', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), toggleCoursePublish)
