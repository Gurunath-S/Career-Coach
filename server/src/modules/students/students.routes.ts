import { Router } from 'express'
import {
  getStudentProfile,
  updateStudentProfile,
  getRegisteredEvents,
  registerForEvent,
  getStudentCourses,
  enrollInCourse,
  completeCourse,
  listStudents,
  getStudentById,
} from './students.controller'
import { authenticate, requireRole } from '../../middlewares/auth'

export const studentsRouter = Router()

// Student Self-Service Routes
studentsRouter.get('/me', authenticate, getStudentProfile)
studentsRouter.get('/profile', authenticate, getStudentProfile)
studentsRouter.put('/me/profile', authenticate, updateStudentProfile)
studentsRouter.put('/profile', authenticate, updateStudentProfile)
studentsRouter.get('/me/events', authenticate, getRegisteredEvents)
studentsRouter.post('/events/:eventId/register', authenticate, registerForEvent)
studentsRouter.get('/me/courses', authenticate, getStudentCourses)
studentsRouter.post('/me/enroll/:courseId', authenticate, enrollInCourse)
studentsRouter.post('/me/enroll', authenticate, enrollInCourse)
studentsRouter.post('/me/courses/:enrollmentId/complete', authenticate, completeCourse)

// Admin Management Routes
studentsRouter.get('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), listStudents)
studentsRouter.get('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), getStudentById)
