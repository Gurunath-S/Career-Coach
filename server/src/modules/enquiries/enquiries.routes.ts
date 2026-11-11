import { Router } from 'express'
import { submitEnquiry, listEnquiries, updateEnquiry } from './enquiries.controller'
import { authenticate, requireRole } from '../../middlewares/auth'
import { validateRequest } from '../../middlewares/validate'
import { enquirySchema, enquiryUpdateSchema } from '@careercatch/shared-types'

export const enquiriesRouter = Router()

// Public form submission
enquiriesRouter.post('/', validateRequest(enquirySchema), submitEnquiry)

// Protected Admin lead management
enquiriesRouter.get('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), listEnquiries)
enquiriesRouter.patch('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), validateRequest(enquiryUpdateSchema), updateEnquiry)
