// CareerCatch Domain Models & Shared TypeScript Interfaces

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface StudentProfile {
  id: string
  userId: string
  phone: string
  education?: string | null
  college?: string | null
  graduationYear?: number | null
  currentRole?: string | null
  bio?: string | null
  resumeUrl?: string | null
  skills: string[]
  registeredEvents?: string[]
}

export interface Course {
  id: number
  title: string
  category: string
  instructor: string
  instructorAvatar: string
  thumbnail: string
  rating: number
  reviews: number
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
  originalPrice: number
  slug?: string
  description?: string
  isPublished?: boolean
}

export interface Mentor {
  id?: number
  name: string
  role: string
  company: string
  experience: string
  avatar: string
  linkedin?: string
  bio?: string
  tags?: string[]
}

export interface Testimonial {
  id?: number
  name: string
  role: string
  company: string
  avatar: string
  text: string
  rating: number
  hike?: string
}

export interface FAQItem {
  id?: number
  q: string
  a: string
  category?: string
}

export interface Project {
  id?: number
  title: string
  description: string
  tags: string[]
  metrics?: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Production Grade'
  image?: string
  githubUrl?: string
  liveUrl?: string
}

export interface HiringPartner {
  id?: number
  name: string
  logo?: string
  tier?: 'tier1' | 'tier2' | 'unicorn'
}

export interface EventCategory {
  id: string
  name: string
  slug: string
  description?: string | null
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  categoryId: string
  categoryName?: string
  speakerName: string
  speakerRole: string
  speakerCompany: string
  speakerAvatar?: string | null
  bannerUrl?: string | null
  eventDate: Date | string
  duration: string
  location: string // e.g. "Online (Zoom)", "Bangalore Hub"
  capacity?: number | null
  registeredCount: number
  isPublished: boolean
  isFeatured: boolean
  tags: string[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'INTERESTED' | 'ENROLLED' | 'NOT_INTERESTED' | 'FOLLOW_UP'

export interface Enquiry {
  id: number
  fullName: string
  email: string
  phone: string
  course?: string | null
  message?: string | null
  source?: string | null
  status: EnquiryStatus
  notes?: string | null
  assignedTo?: string | null
  followUpDate?: Date | string | null
  createdAt: Date | string
  updatedAt?: Date | string
}

export interface PresignedUploadResponse {
  uploadUrl: string
  fileKey: string
  fileUrl: string
}
