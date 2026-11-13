import {
  Course,
  Mentor,
  FAQItem,
  Testimonial,
  Project,
  Event,
  LearningPath,
  StudentProfile,
  DemoRequest,
} from '@careercatch/shared-types'
import { COURSES, MENTORS, FAQS, TESTIMONIALS, PROJECTS } from '@/lib/constants'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

async function fetchWithFallback<T>(endpoint: string, fallbackData: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 },
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return fallbackData
    const json = await res.json()
    return (json.data ?? json) as T
  } catch {
    return fallbackData
  }
}

export const apiService = {
  // ─── Public Content ───────────────────────────────────────────────
  async getCourses(): Promise<Course[]> {
    return fetchWithFallback<Course[]>('/courses', COURSES)
  },

  async getCourseBySlug(slug: string): Promise<Course | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${slug}`, {
        next: { revalidate: 60 },
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        // Fallback search in constants
        const found = COURSES.find((c) => String(c.id) === slug || c.slug === slug)
        return found || null
      }
      const json = await res.json()
      return json.data
    } catch {
      return COURSES.find((c) => String(c.id) === slug || c.slug === slug) || null
    }
  },

  async getMentors(): Promise<Mentor[]> {
    return fetchWithFallback<Mentor[]>('/content/mentors', MENTORS)
  },

  async getTestimonials(): Promise<Testimonial[]> {
    return fetchWithFallback<Testimonial[]>('/content/testimonials', TESTIMONIALS)
  },

  async getFAQs(): Promise<FAQItem[]> {
    return fetchWithFallback<FAQItem[]>('/content/faqs', FAQS)
  },

  async getProjects(): Promise<Project[]> {
    return fetchWithFallback<Project[]>('/content/projects', PROJECTS)
  },

  async getEvents(): Promise<Event[]> {
    return fetchWithFallback<Event[]>('/events', [])
  },

  async getEventBySlug(slug: string): Promise<Event | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${slug}`, {
        next: { revalidate: 60 },
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) return null
      const json = await res.json()
      return json.data
    } catch {
      return null
    }
  },

  async getLearningPaths(): Promise<LearningPath[]> {
    return fetchWithFallback<LearningPath[]>('/learning-paths', [])
  },

  // ─── Lead & Demo Ingestion ────────────────────────────────────────
  async submitEnquiry(data: {
    fullName: string
    email: string
    phone: string
    college?: string
    currentYear?: string
    course?: string
    message?: string
  }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to submit enquiry')
    }
    return json
  },

  async submitDemoRequest(data: {
    fullName: string
    email: string
    phone: string
    college?: string
    courseInterest?: string
    preferredDate?: string
    preferredTime?: string
    message?: string
  }): Promise<{ success: boolean; message: string; data: DemoRequest }> {
    const res = await fetch(`${API_BASE_URL}/demos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to submit demo request')
    }
    return json
  },

  // ─── Authenticated Student Endpoints ──────────────────────────────
  async registerForEvent(eventId: string): Promise<{ success: boolean; message: string; data: any }> {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to register for event')
    }
    return json
  },

  async getStudentProfile(): Promise<StudentProfile & { user: { name: string; email: string; avatar?: string } }> {
    const res = await fetch(`${API_BASE_URL}/students/me`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to fetch student profile')
    }
    return json.data
  },

  async updateStudentProfile(data: Partial<StudentProfile>): Promise<StudentProfile> {
    const res = await fetch(`${API_BASE_URL}/students/me/profile`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to update student profile')
    }
    return json.data
  },

  async getStudentEvents(): Promise<RegisteredEvent[]> {
    const res = await fetch(`${API_BASE_URL}/students/me/events`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to fetch registered events')
    }
    return json.data || []
  },
}

export interface RegisteredEvent {
  id: string
  eventId: string
  studentId?: string
  status: string
  createdAt?: string | Date
  event: {
    id: string
    title: string
    slug: string
    category?: string
    categoryName?: string
    date?: string | Date
    eventDate?: string | Date
    time?: string
    duration?: string
    location: string
    [key: string]: any
  }
}

