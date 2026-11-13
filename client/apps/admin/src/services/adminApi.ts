import { Event, Enquiry, PresignedUploadResponse } from '@careercatch/shared-types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('careercatch_admin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const adminApi = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Login failed')
    return data.data
  },

  async listEvents(): Promise<Event[]> {
    const res = await fetch(`${API_BASE}/events?publishedOnly=false`, {
      headers: { ...getAuthHeader() },
    })
    const data = await res.json()
    return data.data || []
  },

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(eventData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to create event')
    return data.data
  },

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(eventData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to update event')
    return data.data
  },

  async deleteEvent(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || 'Failed to delete event')
    }
  },

  async togglePublish(id: string, isPublished: boolean): Promise<Event> {
    const res = await fetch(`${API_BASE}/events/${id}/publish`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ isPublished }),
    })
    const data = await res.json()
    return data.data
  },

  async getPresignedUploadUrl(fileName: string, fileType: string, folder = 'events'): Promise<PresignedUploadResponse> {
    const res = await fetch(`${API_BASE}/uploads/presigned-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ fileName, fileType, folder, fileSize: 4 * 1024 * 1024 }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to get upload URL')
    return data.data
  },

  async uploadFile(uploadUrl: string, file: File): Promise<void> {
    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    })
  },

  async listEnquiries(): Promise<Enquiry[]> {
    const res = await fetch(`${API_BASE}/enquiries`, {
      headers: { ...getAuthHeader() },
    })
    const data = await res.json()
    return data.data || []
  },

  async updateEnquiryStatus(id: number, status: string, notes?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, notes }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || 'Failed to update enquiry')
    }
  },
}
