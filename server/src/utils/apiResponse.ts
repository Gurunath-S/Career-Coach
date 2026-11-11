import { Response } from 'express'

export function successResponse<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message = 'Success'
) {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
