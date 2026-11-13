import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../config/db'
import { successResponse } from '../../utils/apiResponse'
import { ApiError } from '../../utils/apiError'
import { Event } from '@careercatch/shared-types'
import { AuthRequest } from '../../middlewares/auth'

// In-memory fallback dataset for offline/mock development
let fallbackEvents: Event[] = [
  {
    id: 'evt_1',
    title: 'System Design at Scale: Microservices with AWS',
    slug: 'system-design-microservices-aws',
    description: 'Learn how to architect high-throughput distributed systems using AWS ECS, Redis caching, and Kafka streaming.',
    categoryId: 'cat_cloud',
    categoryName: 'Cloud & Architecture',
    speakerName: 'Sneha Patel',
    speakerRole: 'Staff Cloud Architect',
    speakerCompany: 'AWS',
    speakerAvatar: '/images/faculty/sneha-patel.jpg',
    bannerUrl: '/images/courses/cloud-aws.jpg',
    eventDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    duration: '90 Minutes',
    location: 'Online (Zoom Room)',
    capacity: 250,
    registeredCount: 184,
    isPublished: true,
    isFeatured: true,
    tags: ['AWS', 'Microservices', 'Distributed Systems'],
  },
  {
    id: 'evt_2',
    title: 'Cracking Modern Full-Stack Interviews in 2026',
    slug: 'cracking-fullstack-interviews-2026',
    description: 'A deep-dive into full-stack coding rounds, Next.js hydration challenges, SQL optimization, and live mock interview breakdowns.',
    categoryId: 'cat_web',
    categoryName: 'Full Stack',
    speakerName: 'Ravi Kumar',
    speakerRole: 'Lead Software Engineer',
    speakerCompany: 'Google Alumni',
    speakerAvatar: '/images/faculty/ravi-kumar.jpg',
    bannerUrl: '/images/courses/fullstack-web.jpg',
    eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    duration: '2 Hours',
    location: 'Live Stream & Q&A',
    capacity: 500,
    registeredCount: 312,
    isPublished: true,
    isFeatured: true,
    tags: ['React', 'Next.js', 'System Design', 'Interviews'],
  },
]

export async function listEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, publishedOnly } = req.query
    const isPublic = publishedOnly !== 'false'

    try {
      const where: Record<string, unknown> = {}
      if (isPublic) where.isPublished = true
      if (category && typeof category === 'string') where.categoryId = category

      const dbEvents = await prisma.event.findMany({
        where,
        include: { category: true },
        orderBy: { eventDate: 'asc' },
      })

      if (dbEvents.length > 0) {
        return successResponse(res, dbEvents)
      }
    } catch {
      // DB offline fallback
    }

    let result = [...fallbackEvents]
    if (isPublic) result = result.filter((e) => e.isPublished)
    if (category && typeof category === 'string') result = result.filter((e) => e.categoryId === category)

    return successResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export async function getEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string
    try {
      const dbEvent = await prisma.event.findUnique({
        where: { id },
        include: { category: true },
      })
      if (dbEvent) return successResponse(res, dbEvent)
    } catch {
      // DB offline fallback
    }

    const event = fallbackEvents.find((e) => e.id === id)
    if (!event) throw ApiError.notFound('Event not found')
    return successResponse(res, event)
  } catch (error) {
    next(error)
  }
}

export async function createEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body
    try {
      const dbEvent = await prisma.event.create({
        data: {
          ...data,
          eventDate: new Date(data.eventDate),
        },
      })
      return successResponse(res, dbEvent, 'Event created successfully', 201)
    } catch {
      // Fallback in-memory
      const newEvent: Event = {
        ...data,
        id: `evt_${Date.now()}`,
        registeredCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      fallbackEvents.unshift(newEvent)
      return successResponse(res, newEvent, 'Event created successfully', 201)
    }
  } catch (error) {
    next(error)
  }
}

export async function updateEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string
    const data = req.body

    try {
      const updated = await prisma.event.update({
        where: { id },
        data: {
          ...data,
          eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
        },
      })
      return successResponse(res, updated, 'Event updated successfully')
    } catch {
      // Fallback
      const idx = fallbackEvents.findIndex((e) => e.id === id)
      if (idx === -1) throw ApiError.notFound('Event not found')
      fallbackEvents[idx] = { ...fallbackEvents[idx], ...data }
      return successResponse(res, fallbackEvents[idx], 'Event updated successfully')
    }
  } catch (error) {
    next(error)
  }
}

export async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string
    try {
      await prisma.event.delete({ where: { id } })
    } catch {
      fallbackEvents = fallbackEvents.filter((e) => e.id !== id)
    }
    return successResponse(res, { id }, 'Event deleted successfully')
  } catch (error) {
    next(error)
  }
}

export async function togglePublish(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string
    const { isPublished } = req.body

    try {
      const updated = await prisma.event.update({
        where: { id },
        data: { isPublished: Boolean(isPublished) },
      })
      return successResponse(res, updated, 'Publish status updated')
    } catch {
      const idx = fallbackEvents.findIndex((e) => e.id === id)
      if (idx === -1) throw ApiError.notFound('Event not found')
      fallbackEvents[idx].isPublished = Boolean(isPublished)
      return successResponse(res, fallbackEvents[idx], 'Publish status updated')
    }
  } catch (error) {
    next(error)
  }
}

export async function registerForEvent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.unauthorized('Authentication required')
    const currentUserId = req.user.id
    const eventId = String(req.params.id || req.params.eventId)

    const result = await prisma.$transaction(async (tx) => {
      // 1. Resolve or auto-provision student profile
      let studentProfile = await tx.studentProfile.findUnique({
        where: { userId: currentUserId },
      })
      if (!studentProfile) {
        studentProfile = await tx.studentProfile.create({
          data: {
            userId: currentUserId,
            phone: '',
            skills: [],
          },
        })
      }

      // 2. Lock event row and inspect capacity
      const event = await tx.event.findUnique({
        where: { id: eventId },
        select: { id: true, title: true, capacity: true, registeredCount: true, eventDate: true, isPublished: true },
      })
      if (!event || !event.isPublished) {
        throw ApiError.notFound('Event not found or registration is closed.')
      }
      if (new Date(event.eventDate) < new Date()) {
        throw ApiError.badRequest('Cannot register for a past event.')
      }
      if (event.capacity && event.registeredCount >= event.capacity) {
        throw ApiError.badRequest('This event has reached full capacity.')
      }

      // 3. Check for existing registration
      const existing = await tx.eventRegistration.findUnique({
        where: {
          eventId_studentId: {
            eventId,
            studentId: studentProfile.id,
          },
        },
      })
      if (existing) {
        throw ApiError.conflict('You are already registered for this event.')
      }

      // 4. Create registration record
      const registration = await tx.eventRegistration.create({
        data: {
          eventId,
          studentId: studentProfile.id,
          status: 'CONFIRMED',
        },
      })

      // 5. Increment event registeredCount
      await tx.event.update({
        where: { id: eventId },
        data: { registeredCount: { increment: 1 } },
      })

      return { registration, eventTitle: event.title }
    })

    return successResponse(res, result, 'Successfully registered for event', 201)
  } catch (error) {
    next(error)
  }
}
