import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../config/db'
import { successResponse, paginatedResponse } from '../../utils/apiResponse'
import { ApiError } from '../../utils/apiError'
import { AuthRequest } from '../../middlewares/auth'

export async function submitDemoRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, email, phone, college, courseInterest, preferredDate, preferredTime, message } = req.body

    const demo = await prisma.demoRequest.create({
      data: {
        fullName,
        email,
        phone,
        college: college || null,
        courseInterest: courseInterest || null,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        preferredTime: preferredTime || null,
        message: message || null,
        status: 'PENDING',
      },
    })

    return successResponse(res, demo, 'Demo request submitted successfully. A career counselor will contact you shortly.', 201)
  } catch (error) {
    next(error)
  }
}

export async function listDemoRequests(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status, search, page = '1', limit = '20' } = req.query
    const pageNum = Math.max(1, parseInt(page as string, 10))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)))

    const where: any = {}
    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { college: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [total, demos] = await Promise.all([
      prisma.demoRequest.count({ where }),
      prisma.demoRequest.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return paginatedResponse(res, demos, pageNum, limitNum, total)
  } catch (error) {
    next(error)
  }
}

export async function updateDemoStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) throw ApiError.badRequest('Invalid demo request ID')

    const { status, notes, assignedTo } = req.body

    const updated = await prisma.demoRequest.update({
      where: { id },
      data: {
        status: status || undefined,
        notes: notes !== undefined ? notes : undefined,
        assignedTo: assignedTo !== undefined ? assignedTo : undefined,
      },
    })

    return successResponse(res, updated, 'Demo request status updated successfully')
  } catch (error) {
    next(error)
  }
}
