import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/apiError'
import { config } from '../config/env'

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

  console.error('[Unhandled Error]:', err)
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  })
}
