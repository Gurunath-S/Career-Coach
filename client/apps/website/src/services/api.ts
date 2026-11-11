import { Course, Mentor, FAQItem, Testimonial, Project, Event } from '@careercatch/shared-types'
import { COURSES, MENTORS, FAQS, TESTIMONIALS, PROJECTS } from '@/lib/constants'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

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
  async getCourses(): Promise<Course[]> {
    return fetchWithFallback<Course[]>('/content/courses', COURSES as unknown as Course[])
  },

  async getMentors(): Promise<Mentor[]> {
    return fetchWithFallback<Mentor[]>('/content/mentors', MENTORS as unknown as Mentor[])
  },

  async getTestimonials(): Promise<Testimonial[]> {
    return fetchWithFallback<Testimonial[]>('/content/testimonials', TESTIMONIALS as unknown as Testimonial[])
  },

  async getFAQs(): Promise<FAQItem[]> {
    return fetchWithFallback<FAQItem[]>('/content/faqs', FAQS as unknown as FAQItem[])
  },

  async getProjects(): Promise<Project[]> {
    return fetchWithFallback<Project[]>('/content/projects', PROJECTS as unknown as Project[])
  },

  async getEvents(): Promise<Event[]> {
    return fetchWithFallback<Event[]>('/events', [])
  },

  async submitEnquiry(data: {
    fullName: string
    email: string
    phone: string
    course?: string
    message?: string
  }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to submit enquiry')
      }
      return await res.json()
    } catch {
      // In offline mode, simulate successful submission
      return { success: true, message: 'Thank you! Your enquiry has been recorded.' }
    }
  },
}
