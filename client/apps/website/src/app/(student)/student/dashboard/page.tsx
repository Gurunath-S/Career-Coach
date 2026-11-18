'use client'

import React, { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { StudentDashboardView } from '@/components/dashboard/StudentDashboardView'

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F0F6FF]" />}>
      <Navbar />
      <main>
        <StudentDashboardView />
      </main>
      <Footer />
    </Suspense>
  )
}
