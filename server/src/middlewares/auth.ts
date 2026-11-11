import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env'
import { ApiError } from '../utils/apiError'
import { Role } from '@careercatch/shared-types'

export interface AuthRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    id: string
    email: string
    name: string
    role: Role
  }
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Authentication token is required'))
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string
      email: string
      name: string
      role: Role
    }
    req.user = decoded
    next()
  } catch {
    return next(ApiError.unauthorized('Invalid or expired authentication token'))
  }
}

export function requireRole(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized())
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to access this resource'))
    }
    next()
  }
}
