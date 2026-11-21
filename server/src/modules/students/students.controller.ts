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
    const {
      name,
      avatar,
      phone,
      education,
      college,
      graduationYear,
      currentRole,
      learningGoal,
      desiredRoles,
      interestedCourse,
      skills,
      bio,
      resumeUrl,
    } = req.body

    // Update User name/avatar if provided
    if (avatar !== undefined || (name && typeof name === 'string')) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          avatar: avatar !== undefined ? avatar : undefined,
          name: name ? name.trim() : undefined,
        },
      })
    }

    const toNullable = (v: any) =>
      v === undefined ? undefined : v === null || (typeof v === 'string' && !v.trim()) ? null : v

    const updated = await prisma.studentProfile.upsert({
      where: { userId: req.user.id },
      update: {
        phone: toNullable(phone),
        education: toNullable(education),
        college: toNullable(college),
        graduationYear: graduationYear !== undefined ? (graduationYear ? Number(graduationYear) : null) : undefined,
        currentRole: toNullable(currentRole),
        learningGoal: toNullable(learningGoal),
        desiredRoles: Array.isArray(desiredRoles)
          ? desiredRoles.map((r: any) => String(r).trim()).filter(Boolean)
          : undefined,
        interestedCourse: toNullable(interestedCourse),
        skills: Array.isArray(skills)
          ? skills.map((s: any) => String(s).trim()).filter(Boolean)
          : undefined,
        bio: toNullable(bio),
        resumeUrl: toNullable(resumeUrl),
      },
      create: {
        userId: req.user.id,
        phone: phone || '',
        education: toNullable(education) ?? null,
        college: toNullable(college) ?? null,
        graduationYear: graduationYear ? Number(graduationYear) : null,
        currentRole: toNullable(currentRole) ?? null,
        learningGoal: toNullable(learningGoal) ?? null,
        desiredRoles: Array.isArray(desiredRoles)
          ? desiredRoles.map((r: any) => String(r).trim()).filter(Boolean)
          : [],
        interestedCourse: toNullable(interestedCourse) ?? null,
        skills: Array.isArray(skills)
          ? skills.map((s: any) => String(s).trim()).filter(Boolean)
          : [],
        bio: toNullable(bio) ?? null,
        resumeUrl: toNullable(resumeUrl) ?? null,
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

export async function getStudentCourses(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.unauthorized('Authentication required')

    const enrollments = await prisma.enrollment.findMany({
      where: { email: req.user.email },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
    })

    const demoBookings = await prisma.demoRequest.findMany({
      where: { email: req.user.email },
      orderBy: { createdAt: 'desc' },
    })

    const ongoing = enrollments.filter((e) => e.status !== 'COMPLETED')
    const completed = enrollments.filter((e) => e.status === 'COMPLETED')
    const certificates = completed.map((e) => ({
      id: `CC-CERT-${e.id}-${new Date(e.updatedAt).getFullYear()}`,
      courseTitle: e.course.title,
      courseSlug: e.course.slug,
      studentName: e.studentName || req.user?.name || 'Student',
      completedDate: e.updatedAt,
      grade: 'A+ Distinguished',
      duration: e.course.duration,
      skills: ['Production Architecture', 'State Management', 'Full Stack Deployment'],
    }))

    return successResponse(res, {
      all: enrollments,
      ongoing,
      completed,
      certificates,
      demoBookings,
    })
  } catch (error) {
    next(error)
  }
}

export async function enrollInCourse(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.unauthorized('Authentication required')
    const courseIdParam = req.params.courseId || req.body.courseId
    const courseId = parseInt(String(courseIdParam), 10)

    if (isNaN(courseId)) {
      throw ApiError.badRequest('Valid course ID is required')
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) {
      throw ApiError.notFound('Course not found')
    }

    const existing = await prisma.enrollment.findFirst({
      where: {
        email: req.user.email,
        courseId,
      },
      include: { course: true },
    })

    if (existing) {
      return successResponse(res, existing, 'Already enrolled in this course')
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
    })

    const enrollment = await prisma.enrollment.create({
      data: {
        studentName: req.user.name,
        email: req.user.email,
        phone: studentProfile?.phone || req.body.phone || '9876543210',
        courseId,
        status: 'CONFIRMED',
        amount: course.price,
        paymentId: 'HOLD_PAYMENT_PENDING',
      },
      include: { course: true },
    })

    return successResponse(res, enrollment, 'Successfully enrolled in course', 201)
  } catch (error) {
    next(error)
  }
}

export async function completeCourse(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.unauthorized('Authentication required')
    const enrollmentId = parseInt(String(req.params.enrollmentId), 10)

    const enrollment = await prisma.enrollment.findFirst({
      where: { id: enrollmentId, email: req.user.email },
      include: { course: true },
    })

    if (!enrollment) {
      throw ApiError.notFound('Enrollment not found')
    }

    const updated = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'COMPLETED' },
      include: { course: true },
    })

    return successResponse(res, updated, 'Course marked as completed')
  } catch (error) {
    next(error)
  }
}

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
