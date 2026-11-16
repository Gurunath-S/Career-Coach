import { Router } from 'express'
import {
  adminLogin,
  studentLogin,
  studentRegister,
  studentLogout,
  getMe,
  checkEmail,
  googleSso,
} from './auth.controller'
import { validateRequest } from '../../middlewares/validate'
import { authenticate } from '../../middlewares/auth'
import { loginSchema, registerStudentSchema } from '@careercatch/shared-types'

export const authRouter = Router()

authRouter.post('/admin/login', validateRequest(loginSchema), adminLogin)
authRouter.post('/student/login', validateRequest(loginSchema), studentLogin)
authRouter.post('/student/register', validateRequest(registerStudentSchema), studentRegister)
authRouter.post('/student/logout', studentLogout)
authRouter.post('/student/check-email', checkEmail)
authRouter.post('/student/google-sso', googleSso)
authRouter.get('/me', authenticate, getMe)

