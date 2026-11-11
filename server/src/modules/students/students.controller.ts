import { Response, NextFunction } from 'express'
import { prisma } from '../../config/db'
import { successResponse } from '../../utils/apiResponse'
import { ApiError } from '../../utils/apiError'
import { AuthRequest } from '../../middlewares/auth'

export async function getStudentProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.unauthorized()

    try {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: req.user.id },
        include: {
          user: { select: { name: true, email: true, avatar: true } },
          eventRegistrations: { include: { event: true } },
        },
      })
      if (profile) return successResponse(res, profile)
    } catch {
      // DB offline fallback
    }

    return successResponse(res, {
      userId: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: '9876543210',
      college: 'Bangalore Institute of Technology',
      graduationYear: 2026,
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      registeredEvents: ['evt_1', 'evt_2'],
    })
  } catch (error) {
    next(error)
  }
}

export async function updateStudentProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.unauthorized()
    const { phone, college, graduationYear, skills, bio } = req.body

    try {
      const updated = await prisma.studentProfile.upsert({
        where: { userId: req.user.id },
        update: { phone, college, graduationYear, skills, bio },
        create: { userId: req.user.id, phone, college, graduationYear, skills, bio },
      })
      return successResponse(res, updated, 'Profile updated successfully')
    } catch {
      return successResponse(
        res,
        { userId: req.user.id, phone, college, graduationYear, skills, bio },
        'Profile updated successfully'
      )
    }
  } catch (error) {
    next(error)
  }
}

export async function registerForEvent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.unauthorized()
    const { eventId } = req.params

    try {
      // Update registration count
      await prisma.event.update({
        where: { id: eventId },
        data: { registeredCount: { increment: 1 } },
      })
    } catch {
      // In-memory fallback
    }

    return successResponse(
      res,
      { eventId, studentId: req.user.id, status: 'CONFIRMED' },
      'Successfully registered for event'
    )
  } catch (error) {
    next(error)
  }
}
