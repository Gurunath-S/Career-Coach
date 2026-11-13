import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../config/db'
import { successResponse } from '../../utils/apiResponse'
import { ApiError } from '../../utils/apiError'
import { AuthRequest } from '../../middlewares/auth'

export async function listLearningPaths(req: Request, res: Response, next: NextFunction) {
  try {
    const paths = await prisma.learningPath.findMany({
      where: { isPublished: true },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
                duration: true,
                level: true,
                rating: true,
              },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })

    return successResponse(res, paths)
  } catch (error) {
    next(error)
  }
}

export async function getLearningPath(req: Request, res: Response, next: NextFunction) {
  try {
    const idOrSlug = String(req.params.idOrSlug)
    const isNumeric = /^\d+$/.test(idOrSlug)

    const path = await prisma.learningPath.findFirst({
      where: isNumeric ? { id: parseInt(idOrSlug, 10) } : { slug: idOrSlug },
      include: {
        courses: {
          include: {
            course: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!path) throw ApiError.notFound('Learning path not found')

    return successResponse(res, path)
  } catch (error) {
    next(error)
  }
}

export async function createLearningPath(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, slug, description, icon, outcome, duration, sortOrder, isPublished, courses } = req.body

    const existing = await prisma.learningPath.findUnique({ where: { slug } })
    if (existing) throw ApiError.conflict('A learning path with this slug already exists')

    const created = await prisma.$transaction(async (tx) => {
      const path = await tx.learningPath.create({
        data: {
          title,
          slug,
          description,
          icon: icon || null,
          outcome: outcome || null,
          duration,
          sortOrder: sortOrder || 0,
          isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        },
      })

      if (Array.isArray(courses) && courses.length > 0) {
        await tx.learningPathCourse.createMany({
          data: courses.map((c: any, idx: number) => ({
            learningPathId: path.id,
            courseId: Number(c.courseId),
            sortOrder: c.sortOrder !== undefined ? Number(c.sortOrder) : idx + 1,
            isMandatory: c.isMandatory !== undefined ? Boolean(c.isMandatory) : true,
            notes: c.notes || null,
          })),
        })
      }

      return path
    })

    return successResponse(res, created, 'Learning path created successfully', 201)
  } catch (error) {
    next(error)
  }
}
