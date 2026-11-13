import { Router } from 'express'
import {
  getCourses,
  getMentors,
  getTestimonials,
  getFAQs,
  getProjects,
} from './content.controller'

export const contentRouter = Router()

contentRouter.get('/courses', getCourses)
contentRouter.get('/mentors', getMentors)
contentRouter.get('/testimonials', getTestimonials)
contentRouter.get('/faqs', getFAQs)
contentRouter.get('/projects', getProjects)

