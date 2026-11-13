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
    phone: string
    college?: string
    education?: string
  }) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined)

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StudentUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        const json = await res.json()
        setUser(json.data)
      } else {
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
    setUser(json.data.user)
  }

  const register = async (formData: {
    name: string
    email: string
    password: string
    phone: string
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
    setUser(json.data.user)
  }

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/student/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setUser(null)
      window.location.href = '/student/login'
    }
  }

  return (
    <StudentAuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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
