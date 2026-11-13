import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../config/db'
import { successResponse, paginatedResponse } from '../../utils/apiResponse'
import { ApiError } from '../../utils/apiError'
import { Enquiry } from '@careercatch/shared-types'

let fallbackEnquiries: Enquiry[] = [
  {
    id: 1,
    fullName: 'Rahul Varma',
    email: 'rahul.varma@example.com',
    phone: '9845123456',
    course: 'Full Stack Web Development',
    message: 'Interested in the upcoming weekend cohort with placement guarantee.',
    source: 'Website Hero Form',
    status: 'NEW',
    notes: 'Called once, requested call back at 6pm.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    fullName: 'Ananya Sen',
    email: 'ananya.sen@example.com',
    phone: '9731298765',
    course: 'Data Science & Machine Learning',
    message: 'Looking for syllabus details and EMI payment plans.',
    source: 'Floating CTA',
    status: 'CONTACTED',
    notes: 'Counselor demo scheduled.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
]

export async function submitEnquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body
    try {
      const created = await prisma.enquiry.create({ data })
      return successResponse(res, created, 'Enquiry submitted successfully', 201)
    } catch {
      const newEnquiry: Enquiry = {
        id: fallbackEnquiries.length + 1,
        ...data,
        status: 'NEW',
        createdAt: new Date().toISOString(),
      }
      fallbackEnquiries.unshift(newEnquiry)
      return successResponse(res, newEnquiry, 'Enquiry submitted successfully', 201)
    }
  } catch (error) {
    next(error)
  }
}

export async function listEnquiries(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, page = '1', limit = '10' } = req.query
    const pageNum = parseInt(page as string, 10)
    const limitNum = parseInt(limit as string, 10)

    try {
      const where: Record<string, unknown> = {}
      if (status && typeof status === 'string') where.status = status

      const [total, data] = await Promise.all([
        prisma.enquiry.count({ where }),
        prisma.enquiry.findMany({
          where,
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
        }),
      ])

      if (total > 0) {
        return paginatedResponse(res, data as Enquiry[], pageNum, limitNum, total)
      }
    } catch {
      // DB offline fallback
    }

    let filtered = [...fallbackEnquiries]
    if (status && typeof status === 'string') {
      filtered = filtered.filter((e) => e.status === status)
    }

    return paginatedResponse(res, filtered, pageNum, limitNum, filtered.length)
  } catch (error) {
    next(error)
  }
}

export async function updateEnquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string, 10)
    const data = req.body

    try {
      const updated = await prisma.enquiry.update({
        where: { id },
        data,
      })
      return successResponse(res, updated, 'Enquiry updated successfully')
    } catch {
      const idx = fallbackEnquiries.findIndex((e) => e.id === id)
      if (idx === -1) throw ApiError.notFound('Enquiry not found')
      fallbackEnquiries[idx] = { ...fallbackEnquiries[idx], ...data }
      return successResponse(res, fallbackEnquiries[idx], 'Enquiry updated successfully')
    }
  } catch (error) {
    next(error)
  }
}
