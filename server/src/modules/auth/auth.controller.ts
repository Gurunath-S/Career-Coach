import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../config/db'
import { config } from '../../config/env'
import { ApiError } from '../../utils/apiError'
import { successResponse } from '../../utils/apiResponse'
import { AuthRequest } from '../../middlewares/auth'

export async function adminLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body

    // Find admin user in DB or provide developer admin fallback
    let user = null
    try {
      user = await prisma.user.findUnique({ where: { email } })
    } catch {
      // If DB is offline, continue to fallback
    }

    if (!user) {
      // Default admin account for bootstrapping
      if (email === 'admin@careercatch.in' && password === 'Admin@2026') {
        user = {
          id: 'admin_root_1',
          name: 'CareerCatch Admin',
          email: 'admin@careercatch.in',
          role: 'SUPER_ADMIN' as const,
          avatar: null,
          passwordHash: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      } else {
        throw ApiError.unauthorized('Invalid email or password')
      }
    } else {
      const isValid = await bcrypt.compare(password, user.passwordHash)
      if (!isValid) {
        throw ApiError.unauthorized('Invalid email or password')
      }
      if (user.role === 'STUDENT') {
        throw ApiError.forbidden('Access denied. Administrator privileges required.')
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    )

    return successResponse(
      res,
      {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      },
      'Admin logged in successfully'
    )
  } catch (error) {
    next(error)
  }
}

function setStudentSessionCookie(res: Response, token: string) {
  res.cookie('careercatch_student_session', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  })
}

export async function studentLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true },
    })

    if (!user || user.role !== 'STUDENT') {
      throw ApiError.unauthorized('Invalid student credentials')
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      throw ApiError.unauthorized('Invalid student credentials')
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    )

    setStudentSessionCookie(res, token)

    return successResponse(
      res,
      {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
      'Student logged in successfully'
    )
  } catch (error) {
    next(error)
  }
}

export async function studentRegister(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, phone, college, education } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'STUDENT',
        studentProfile: {
          create: {
            phone,
            college,
            education,
            skills: [],
          },
        },
      },
    })

    const token = jwt.sign(
      { id: createdUser.id, email: createdUser.email, name: createdUser.name, role: 'STUDENT' },
      config.jwtSecret,
      { expiresIn: '7d' }
    )

    setStudentSessionCookie(res, token)

    return successResponse(
      res,
      {
        token,
        user: { id: createdUser.id, name: createdUser.name, email: createdUser.email, role: 'STUDENT' },
      },
      'Account created successfully',
      201
    )
  } catch (error) {
    next(error)
  }
}

export async function studentLogout(req: Request, res: Response) {
  res.clearCookie('careercatch_student_session', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
  })
  return successResponse(res, null, 'Logged out successfully')
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.unauthorized()
    return successResponse(res, req.user, 'Current user profile')
  } catch (error) {
    next(error)
  }
}
