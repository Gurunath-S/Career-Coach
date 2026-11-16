'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { API_BASE_URL } from '@/services/api'

interface StudentUser {
  id: string
  name: string
  email: string
  role: string
  avatar?: string | null
}

interface StudentAuthContextType {
  user: StudentUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    name: string
    email: string
    password: string
    phone?: string
    college?: string
    education?: string
  }) => Promise<void>
  checkEmail: (email: string) => Promise<{ exists: boolean; name?: string | null }>
  googleSso: (email: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined)

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StudentUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('careercatch_student_token')
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        const json = await res.json()
        setUser(json.data)
      } else {
        localStorage.removeItem('careercatch_student_token')
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/student/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Login failed')
    }
    if (json.data?.token && typeof window !== 'undefined') {
      localStorage.setItem('careercatch_student_token', json.data.token)
    }
    setUser(json.data.user)
  }

  const register = async (formData: {
    name: string
    email: string
    password: string
    phone?: string
    college?: string
    education?: string
  }) => {
    const res = await fetch(`${API_BASE_URL}/auth/student/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Registration failed')
    }
    if (json.data?.token && typeof window !== 'undefined') {
      localStorage.setItem('careercatch_student_token', json.data.token)
    }
    setUser(json.data.user)
  }

  const checkEmail = async (email: string) => {
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
  }

  const googleSso = async (email: string, name?: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/student/google-sso`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Google SSO failed')
    }
    if (json.data?.token && typeof window !== 'undefined') {
      localStorage.setItem('careercatch_student_token', json.data.token)
    }
    setUser(json.data.user)
  }

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/student/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('careercatch_student_token')
      }
      setUser(null)
      window.location.href = '/student/login'
    }
  }

  return (
    <StudentAuthContext.Provider
      value={{ user, loading, login, register, checkEmail, googleSso, logout, refreshUser }}
    >
      {children}
    </StudentAuthContext.Provider>
  )
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext)
  if (!context) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider')
  }
  return context
}
