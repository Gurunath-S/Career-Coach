import { Router } from 'express'
import { getStudentProfile, updateStudentProfile, registerForEvent } from './students.controller'
import { authenticate } from '../../middlewares/auth'

export const studentsRouter = Router()

studentsRouter.get('/profile', authenticate, getStudentProfile)
studentsRouter.put('/profile', authenticate, updateStudentProfile)
studentsRouter.post('/events/:eventId/register', authenticate, registerForEvent)
