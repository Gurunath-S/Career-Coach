import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/apiError'
import { config } from '../config/env'
import { Prisma } from '@prisma/client'

export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      stack: config.nodeEnv === 'development' ? err.stack : undefined,
    })
  }

  // Handle Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[Prisma Known Error ${err.code}] [${req.method} ${req.originalUrl}]:`, err.message)
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field'
      return res.status(409).json({
        success: false,
        message: `A record with this ${target} already exists.`,
      })
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'The requested resource was not found.',
      })
    }
    return res.status(400).json({
      success: false,
      message: 'Database operation failed due to invalid constraints.',
    })
  }

  console.error(`[Unhandled Error] [${req.method} ${req.originalUrl}]:`, err)
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  })
}
