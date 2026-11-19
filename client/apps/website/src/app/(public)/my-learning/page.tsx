'use client'

import React, { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { StudentDashboardView } from '@/components/dashboard/StudentDashboardView'
import { useStudentAuth } from '@/context/StudentAuthContext'

function MyLearningContent() {
  const { user, loading } = useStudentAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/student/login?redirect=/my-learning')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F6FF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading your learning space...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Navbar />
      <main>
        <StudentDashboardView />
      </main>
      <Footer />
    </>
  )
}

export default function MyLearningPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F0F6FF]" />}>
      <MyLearningContent />
    </Suspense>
  )
}
