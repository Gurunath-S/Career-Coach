'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStudentAuth } from '@/context/StudentAuthContext'

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useStudentAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/student/login?redirect=' + encodeURIComponent(window.location.pathname))
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F6FF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Verifying student session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <div className="student-dashboard-wrapper min-h-screen">{children}</div>
}
