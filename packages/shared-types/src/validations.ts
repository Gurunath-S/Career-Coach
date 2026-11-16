import { z } from 'zod'

// ─── Authentication Schemas ──────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerStudentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional().or(z.literal('')),
  education: z.string().optional(),
  college: z.string().optional(),
  graduationYear: z.number().int().optional(),
})

// ─── Event Schemas ───────────────────────────────────────────────────
export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  speakerName: z.string().min(2, 'Speaker name is required'),
  speakerRole: z.string().min(2, 'Speaker role is required'),
  speakerCompany: z.string().min(1, 'Speaker company is required'),
  speakerAvatar: z.string().url().optional().or(z.literal('')),
  bannerUrl: z.string().url().optional().or(z.literal('')),
  eventDate: z.string().min(1, 'Event date and time is required'),
  duration: z.string().min(1, 'Duration is required'),
  location: z.string().min(1, 'Location is required (e.g. Online or Venue)'),
  capacity: z.number().int().positive().optional().nullable(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
})

export const eventCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
})

// ─── Course Schema ───────────────────────────────────────────────────
export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  instructor: z.string().min(2),
  instructorAvatar: z.string().url().optional().or(z.literal('')),
  thumbnail: z.string().url().optional().or(z.literal('')),
  rating: z.number().min(0).max(5).default(0),
  reviews: z.number().int().min(0).default(0),
  duration: z.string().min(1),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive('Original price must be positive'),
  isPublished: z.boolean().default(false),
  syllabus: z.any().optional(),
})

// ─── Mentor Schema ───────────────────────────────────────────────────
export const mentorSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  company: z.string().min(1),
  experience: z.string().min(1),
  avatar: z.string().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  bio: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

// ─── Enquiry Schema (Public Lead Form) ───────────────────────────────
export const enquirySchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required').max(15),
  college: z.string().optional(),
  currentYear: z.string().optional(),
  course: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
})

export const enquiryUpdateSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'INTERESTED', 'ENROLLED', 'NOT_INTERESTED', 'FOLLOW_UP']).optional(),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
  followUpDate: z.string().optional().nullable(),
})

// ─── Demo Request Schemas ───────────────────────────────────────────
export const demoRequestSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required').max(15),
  college: z.string().optional(),
  courseInterest: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().optional(),
})

export const demoRequestStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
})

// ─── Learning Path Schema ───────────────────────────────────────────
export const learningPathSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(10),
  icon: z.string().optional(),
  outcome: z.string().optional(),
  duration: z.string().min(1),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
  courses: z.array(z.object({
    courseId: z.number().int(),
    sortOrder: z.number().int().default(0),
    isMandatory: z.boolean().default(true),
    notes: z.string().optional(),
  })).default([]),
})

// ─── Presigned S3 Upload Request Schema ──────────────────────────────
export const presignedUrlRequestSchema = z.object({
  fileName: z.string().min(1, 'Filename is required'),
  fileType: z.string().regex(/^image\/(jpeg|png|webp|svg\+xml)$/, 'Allowed file types are JPEG, PNG, WebP, SVG'),
  fileSize: z.number().max(5 * 1024 * 1024, 'File size must be 5MB or less'),
  folder: z.enum(['events', 'courses', 'mentors', 'avatars']).default('events'),
})
