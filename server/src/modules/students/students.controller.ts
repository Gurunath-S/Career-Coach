import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../config/db'
import { successResponse, paginatedResponse } from '../../utils/apiResponse'
import { ApiError } from '../../utils/apiError'
import { AuthRequest } from '../../middlewares/auth'
import { registerForEvent as canonicalRegisterForEvent } from '../events/events.controller'

// ─── STUDENT SELF-SERVICE ─────────────────────────────────────────────

export async function getStudentProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.unauthorized('Authentication required')

    let profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true, role: true } },
        eventRegistrations: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                slug: true,
                eventDate: true,
                duration: true,
                location: true,
                bannerUrl: true,
                speakerName: true,
                speakerRole: true,
                speakerCompany: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!profile) {
      // Auto-provision profile shell
      profile = await prisma.studentProfile.create({
        data: {
          userId: req.user.id,
          phone: '',
          skills: [],
        },
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true, role: true } },
          eventRegistrations: { include: { event: true } },
        },
      })
    }

    return successResponse(res, profile)
  } catch (error) {
    next(error)
  }
}

export async function updateStudentProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.unauthorized('Authentication required')
    const { phone, college, graduationYear, currentRole, skills, bio, resumeUrl } = req.body

    const updated = await prisma.studentProfile.upsert({
      where: { userId: req.user.id },
      update: {
        phone: phone ?? undefined,
        college: college ?? undefined,
        graduationYear: graduationYear ? Number(graduationYear) : undefined,
        currentRole: currentRole ?? undefined,
        skills: Array.isArray(skills) ? skills : undefined,
        bio: bio ?? undefined,
        resumeUrl: resumeUrl ?? undefined,
      },
      create: {
        userId: req.user.id,
        phone: phone || '',
        college: college || null,
        graduationYear: graduationYear ? Number(graduationYear) : null,
        currentRole: currentRole || null,
        skills: Array.isArray(skills) ? skills : [],
        bio: bio || null,
        resumeUrl: resumeUrl || null,
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    })

    return successResponse(res, updated, 'Profile updated successfully')
  } catch (error) {
    next(error)
  }
}

export async function getRegisteredEvents(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.unauthorized('Authentication required')

    const registrations = await prisma.eventRegistration.findMany({
      where: { student: { userId: req.user.id } },
      include: {
        event: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(res, registrations)
  } catch (error) {
    next(error)
  }
}

// Backward-compatible alias routing to canonical register handler
export const registerForEvent = canonicalRegisterForEvent

// ─── ADMIN STUDENT MANAGEMENT ─────────────────────────────────────────

export async function listStudents(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = '1', limit = '20', search = '' } = req.query
    const pageNum = Math.max(1, parseInt(page as string, 10))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)))

    const where: any = { role: 'STUDENT' }
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { studentProfile: { college: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const [total, students] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
          studentProfile: {
            select: {
              phone: true,
              college: true,
              graduationYear: true,
              skills: true,
              _count: { select: { eventRegistrations: true } },
            },
          },
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return paginatedResponse(res, students, pageNum, limitNum, total)
  } catch (error) {
    next(error)
  }
}

export async function getStudentById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id)

    const student = await prisma.user.findFirst({
      where: { id, role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        studentProfile: {
          include: {
            eventRegistrations: {
              include: { event: true },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    })

    if (!student) throw ApiError.notFound('Student record not found')

    return successResponse(res, student)
  } catch (error) {
    next(error)
  }
}
