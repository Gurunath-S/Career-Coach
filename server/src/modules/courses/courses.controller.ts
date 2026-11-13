import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../config/db'
import { successResponse, paginatedResponse } from '../../utils/apiResponse'
import { ApiError } from '../../utils/apiError'
import { AuthRequest } from '../../middlewares/auth'

export async function listCourses(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, search, publishedOnly, page = '1', limit = '50' } = req.query
    const pageNum = Math.max(1, parseInt(page as string, 10))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)))

    const where: any = {}
    if (publishedOnly !== 'false') {
      where.isPublished = true
    }
    if (category && typeof category === 'string' && category !== 'ALL') {
      where.category = { contains: category, mode: 'insensitive' }
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { instructor: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [total, courses] = await Promise.all([
      prisma.course.count({ where }),
      prisma.course.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: [{ rating: 'desc' }, { id: 'asc' }],
      }),
    ])

    return paginatedResponse(res, courses, pageNum, limitNum, total)
  } catch (error) {
    next(error)
  }
}

export async function getCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const idOrSlug = String(req.params.idOrSlug)

    const isNumeric = /^\d+$/.test(idOrSlug)
    const course = await prisma.course.findFirst({
      where: isNumeric ? { id: parseInt(idOrSlug, 10) } : { slug: idOrSlug },
      include: {
        learningPaths: {
          include: { learningPath: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!course) {
      throw ApiError.notFound('Course not found')
    }

    return successResponse(res, course)
  } catch (error) {
    next(error)
  }
}

export async function createCourse(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body

    const existing = await prisma.course.findUnique({ where: { slug: data.slug } })
    if (existing) {
      throw ApiError.conflict('A course with this slug already exists')
    }

    const course = await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        category: data.category,
        instructor: data.instructor,
        instructorAvatar: data.instructorAvatar || null,
        thumbnail: data.thumbnail || null,
        rating: data.rating !== undefined ? Number(data.rating) : 0,
        reviews: data.reviews !== undefined ? Number(data.reviews) : 0,
        duration: data.duration,
        level: data.level || 'BEGINNER',
        price: Number(data.price),
        originalPrice: Number(data.originalPrice),
        isPublished: Boolean(data.isPublished),
        syllabus: data.syllabus || null,
      },
    })

    return successResponse(res, course, 'Course created successfully', 201)
  } catch (error) {
    next(error)
  }
}

export async function updateCourse(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) throw ApiError.badRequest('Invalid course ID')

    const data = req.body

    const updated = await prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        category: data.category,
        instructor: data.instructor,
        instructorAvatar: data.instructorAvatar,
        thumbnail: data.thumbnail,
        rating: data.rating !== undefined ? Number(data.rating) : undefined,
        reviews: data.reviews !== undefined ? Number(data.reviews) : undefined,
        duration: data.duration,
        level: data.level,
        price: data.price !== undefined ? Number(data.price) : undefined,
        originalPrice: data.originalPrice !== undefined ? Number(data.originalPrice) : undefined,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : undefined,
        syllabus: data.syllabus !== undefined ? data.syllabus : undefined,
      },
    })

    return successResponse(res, updated, 'Course updated successfully')
  } catch (error) {
    next(error)
  }
}

export async function deleteCourse(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) throw ApiError.badRequest('Invalid course ID')

    await prisma.course.delete({ where: { id } })
    return successResponse(res, { id }, 'Course deleted successfully')
  } catch (error) {
    next(error)
  }
}

export async function toggleCoursePublish(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) throw ApiError.badRequest('Invalid course ID')
    const { isPublished } = req.body

    const updated = await prisma.course.update({
      where: { id },
      data: { isPublished: Boolean(isPublished) },
    })

    return successResponse(res, updated, 'Course publish status updated')
  } catch (error) {
    next(error)
  }
}
