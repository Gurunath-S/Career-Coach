'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/common/Logo'
import {
  CalendarBlank,
  BookOpen,
  User,
  SignOut,
  Sparkle,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle,
} from '@phosphor-icons/react'

export default function StudentDashboardPage() {
  const router = useRouter()
  const [student, setStudent] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('careercatch_student_user')
    if (raw) {
      try {
        setStudent(JSON.parse(raw))
      } catch {
        setStudent({ name: 'Alex Hunter', email: 'alex@example.com' })
      }
    } else {
      setStudent({ name: 'Alex Hunter', email: 'alex@example.com' })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('careercatch_student_token')
    localStorage.removeItem('careercatch_student_user')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#F0F6FF] font-inter">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Logo />
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-[#155EEF] border border-blue-100">
              Student Hub
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/student/events"
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#155EEF] transition-colors"
            >
              Browse Events
            </Link>
            <Link
              href="/student/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs sm:text-sm font-medium text-[#101B3C] transition-all"
            >
              <User size={16} weight="bold" />
              <span className="hidden sm:inline">{student?.name || 'Profile'}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <SignOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Welcome Hero Card */}
        <div className="bg-gradient-to-r from-[#101B3C] to-[#155EEF] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
            <Sparkle size={300} weight="fill" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold tracking-wide text-blue-200 mb-4 border border-white/10">
              <Sparkle size={14} weight="fill" className="text-amber-400" />
              <span>Career Acceleration Cohort 2026</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
              Welcome back, {student?.name?.split(' ')[0] || 'Learner'}!
            </h1>
            <p className="mt-2 text-sm sm:text-base text-blue-100 leading-relaxed">
              Track your upcoming tech events, enrolled programs, and 1:1 code mentorship sessions all in one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/#courses"
                className="px-4 py-2 rounded-xl bg-white text-[#101B3C] text-xs sm:text-sm font-bold hover:bg-blue-50 transition-all inline-flex items-center gap-1.5 shadow-xs"
              >
                <span>Explore Tech Tracks</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
              <Link
                href="/student/events"
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5"
              >
                <CalendarBlank size={16} />
                <span>Upcoming Workshops</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Registered Events */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#155EEF] flex items-center justify-center">
                    <CalendarBlank size={18} weight="bold" />
                  </div>
                  <h2 className="text-lg font-bold text-[#101B3C] font-display">
                    Your Registered Events
                  </h2>
                </div>
                <Link
                  href="/student/events"
                  className="text-xs font-semibold text-[#155EEF] hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 hover:border-[#155EEF]/40 transition-colors bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        CONFIRMED
                      </span>
                      <span className="text-xs text-slate-500">Live Online</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#101B3C]">
                      System Design at Scale: Microservices with AWS
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> Tomorrow, 6:00 PM IST
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> Zoom Room
                      </span>
                    </div>
                  </div>
                  <button className="px-3.5 py-1.5 rounded-lg bg-[#155EEF] text-white text-xs font-semibold hover:bg-[#124BBF] transition-all shrink-0">
                    Join Session
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 hover:border-[#155EEF]/40 transition-colors bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        UPCOMING
                      </span>
                      <span className="text-xs text-slate-500">Masterclass</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#101B3C]">
                      Cracking Modern Full-Stack Interviews in 2026
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> Sunday, 11:00 AM IST
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> Live Stream
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 shrink-0">
                    <CheckCircle size={16} weight="fill" /> Registered
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Learning Path */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <BookOpen size={18} weight="bold" />
                </div>
                <h2 className="text-lg font-bold text-[#101B3C] font-display">
                  Recommended Career Track
                </h2>
              </div>

              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[#101B3C]">
                    Full Stack Web Engineering (Next.js + TypeScript + Node)
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Includes 6 capstones, 1:1 code reviews, and placement assistance.
                  </p>
                </div>
                <Link
                  href="/#enquiry"
                  className="px-3.5 py-1.5 rounded-lg bg-[#155EEF] text-white text-xs font-semibold hover:bg-[#124BBF] transition-all shrink-0 text-center"
                >
                  Request Syllabus
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Summary & Advisor Hotline */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
              <h3 className="text-sm font-bold text-[#101B3C] font-display uppercase tracking-wider mb-4">
                Student Profile
              </h3>
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#155EEF] font-bold text-lg flex items-center justify-center font-display">
                  {student?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#101B3C]">{student?.name || 'Student'}</h4>
                  <p className="text-xs text-slate-500">{student?.email || 'student@careercatch.in'}</p>
                </div>
              </div>

              <div className="py-3 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="font-semibold text-emerald-600">Active Member</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Events Attended</span>
                  <span className="font-semibold text-slate-700">2</span>
                </div>
              </div>

              <Link
                href="/student/profile"
                className="mt-2 block w-full py-2 text-center rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Edit Profile & Skills
              </Link>
            </div>

            <div className="bg-[#101B3C] text-white rounded-2xl p-6 shadow-xs">
              <h4 className="text-sm font-bold font-display mb-1">Need Career Guidance?</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Speak directly with our senior mentors for profile evaluation and career roadmap planning.
              </p>
              <a
                href="tel:18008902282"
                className="block w-full py-2.5 text-center rounded-xl bg-[#155EEF] text-white text-xs font-bold hover:bg-[#124BBF] transition-all shadow-xs"
              >
                Call Hotline: 1800-890-2282
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
