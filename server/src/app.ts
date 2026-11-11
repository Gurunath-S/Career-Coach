import express, { Express } from 'express'
import cors from 'cors'
import { config } from './config/env'
import { errorHandler } from './middlewares/error'
import { authRouter } from './modules/auth/auth.routes'
import { eventsRouter } from './modules/events/events.routes'
import { categoriesRouter } from './modules/categories/categories.routes'
import { enquiriesRouter } from './modules/enquiries/enquiries.routes'
import { contentRouter } from './modules/content/content.routes'
import { uploadsRouter } from './modules/uploads/uploads.routes'
import { studentsRouter } from './modules/students/students.routes'

export function createApp(): Express {
  const app = express()

  // Middlewares
  app.use(
    cors({
      origin: config.corsOrigin === '*' ? true : config.corsOrigin,
      credentials: true,
    })
  )
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
  app.use('/api/v1/content', contentRouter)
  app.use('/api/v1/uploads', uploadsRouter)
  app.use('/api/v1/students', studentsRouter)

  // Global Error Handler
  app.use(errorHandler)

  return app
}
