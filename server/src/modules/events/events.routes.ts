import { Router } from 'express'
import {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  togglePublish,
} from './events.controller'
import { authenticate, requireRole } from '../../middlewares/auth'
import { validateRequest } from '../../middlewares/validate'
import { eventSchema } from '@careercatch/shared-types'

export const eventsRouter = Router()

// Public routes
eventsRouter.get('/', listEvents)
eventsRouter.get('/:id', getEvent)

// Protected Admin routes
eventsRouter.post('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), validateRequest(eventSchema), createEvent)
eventsRouter.put('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), validateRequest(eventSchema), updateEvent)
eventsRouter.delete('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), deleteEvent)
eventsRouter.patch('/:id/publish', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), togglePublish)
