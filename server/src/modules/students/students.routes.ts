import { Router } from 'express'
import {
  getStudentProfile,
  updateStudentProfile,
  getRegisteredEvents,
  registerForEvent,
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

// Admin Management Routes
studentsRouter.get('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), listStudents)
studentsRouter.get('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), getStudentById)
