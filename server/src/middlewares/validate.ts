import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { ApiError } from '../utils/apiError'

export function validateRequest(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
        return next(ApiError.badRequest('Validation error', issues))
      }
      next(error)
    }
  }
}
