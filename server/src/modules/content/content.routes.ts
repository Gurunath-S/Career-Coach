import { Router } from 'express'
import { getCourses, getMentors } from './content.controller'

export const contentRouter = Router()

contentRouter.get('/courses', getCourses)
contentRouter.get('/mentors', getMentors)
