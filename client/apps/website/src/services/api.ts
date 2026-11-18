import {
  Course,
  Mentor,
  FAQItem,
  Testimonial,
  Project,
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
function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('careercatch_student_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  return headers
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


  async getStudentCourses(): Promise<{
    all: Record<string, unknown>[]
    ongoing: Record<string, unknown>[]
    completed: Record<string, unknown>[]
    certificates: Record<string, unknown>[]
    demoBookings: Record<string, unknown>[]
  }> {
    const res = await fetch(`${API_BASE_URL}/students/me/courses`, {
      credentials: 'include',
      headers: getAuthHeaders(),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to fetch student courses')
    }
    return json.data || { all: [], ongoing: [], completed: [], certificates: [], demoBookings: [] }
  },

  async enrollInCourse(courseId: number): Promise<unknown> {
    const res = await fetch(`${API_BASE_URL}/students/me/enroll/${courseId}`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to enroll in course')
    }
    return json.data
  },

  async completeCourse(enrollmentId: number): Promise<unknown> {
    const res = await fetch(`${API_BASE_URL}/students/me/courses/${enrollmentId}/complete`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to complete course')
    }
    return json.data
  },

  async checkEmail(email: string): Promise<{ exists: boolean; name?: string | null }> {
    const res = await fetch(`${API_BASE_URL}/auth/student/check-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to check email')
    }
    return json.data
  },

  async googleSso(params: { credential?: string; accessToken?: string }): Promise<unknown> {
    const res = await fetch(`${API_BASE_URL}/auth/student/google-sso`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Google SSO failed')
    }
    return json.data
  },
}

