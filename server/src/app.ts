import express, { Express } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './config/env'
import { errorHandler } from './middlewares/error'
import { authRouter } from './modules/auth/auth.routes'
import { eventsRouter } from './modules/events/events.routes'
import { categoriesRouter } from './modules/categories/categories.routes'
import { enquiriesRouter } from './modules/enquiries/enquiries.routes'
import { contentRouter } from './modules/content/content.routes'
import { uploadsRouter } from './modules/uploads/uploads.routes'
import { studentsRouter } from './modules/students/students.routes'

import { coursesRouter } from './modules/courses/courses.routes'
import { demosRouter } from './modules/demos/demos.routes'
import { learningPathsRouter } from './modules/learning-paths/learningPaths.routes'

export function createApp(): Express {
  const app = express()

  // Middlewares
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || config.corsOrigins.includes(origin)) {
          return callback(null, true)
        }
        return callback(new Error(`Origin ${origin} is not allowed by CORS`))
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    })
  )
  app.use(cookieParser(config.cookieSecret))
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  // Health checks
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() })
  })
  app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      version: '1.0.0',
      service: 'CareerCatch Centralized API',
      timestamp: new Date().toISOString(),
    })
  })

  // REST API Routes
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/events', eventsRouter)
  app.use('/api/v1/categories', categoriesRouter)
  app.use('/api/v1/enquiries', enquiriesRouter)
  app.use('/api/v1/courses', coursesRouter)
  app.use('/api/v1/demos', demosRouter)
  app.use('/api/v1/learning-paths', learningPathsRouter)
  app.use('/api/v1/content', contentRouter)
  app.use('/api/v1/uploads', uploadsRouter)
  app.use('/api/v1/students', studentsRouter)

  // Global Error Handler
  app.use(errorHandler)

  return app
}
