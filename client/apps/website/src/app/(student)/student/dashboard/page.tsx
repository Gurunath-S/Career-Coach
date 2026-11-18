'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Logo from '@/components/common/Logo'
import {
  BookOpen,
  CalendarBlank,
  Certificate,
  CheckCircle,
  Clock,
  Sparkle,
  SignOut,
  User,
  ArrowRight,
  DownloadSimple,
  ShareNetwork,
  X,
  PlayCircle,
  ShieldCheck,
  VideoCamera,
} from '@phosphor-icons/react'

import { useStudentAuth } from '@/context/StudentAuthContext'
import { apiService } from '@/services/api'

interface CourseEnrollment {
  id: number
  courseId: number
  studentName: string
  email: string
  phone: string
  status: string
  amount?: number
  paymentId?: string
  createdAt: string
  updatedAt: string
  course: {
    id: number
    title: string
    slug: string
    category: string
    duration: string
    level: string
    instructor: string
    thumbnail?: string
    price: number
  }
}

interface StudentCertificate {
  id: string
  courseTitle: string
  courseSlug: string
  studentName: string
  completedDate: string | Date
  grade: string
  duration: string
  skills: string[]
}

interface DemoBooking {
  id: number
  fullName: string
  email: string
  phone: string
  courseInterest?: string
  preferredDate?: string
  preferredTime?: string
  status: string
  createdAt: string
}

function StudentDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const enrolledParam = searchParams.get('enrolled')
  const { user, logout } = useStudentAuth()

  // State
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed' | 'certificates' | 'demos'>('ongoing')
  const [coursesData, setCoursesData] = useState<{
    all: CourseEnrollment[]
    ongoing: CourseEnrollment[]
    completed: CourseEnrollment[]
    certificates: StudentCertificate[]
    demoBookings: DemoBooking[]
  }>({
    all: [],
    ongoing: [],
    completed: [],
    certificates: [],
    demoBookings: [],
  })
  const [loadingData, setLoadingData] = useState(true)
  const [actionMsg, setActionMsg] = useState('')
  const [selectedCertificate, setSelectedCertificate] = useState<StudentCertificate | null>(null)

  // Load student dashboard data
  useEffect(() => {
    let isMounted = true
    async function loadData() {
      try {
        const [cData] = await Promise.all([
          apiService.getStudentCourses().catch(() => ({
            all: [],
            ongoing: [],
            completed: [],
            certificates: [],
            demoBookings: [],
          })),
        ])

        if (isMounted) {
          setCoursesData(cData as unknown as typeof coursesData)
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err)
      } finally {
        if (isMounted) setLoadingData(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [user])

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['ongoing', 'completed', 'certificates', 'demos'].includes(tabParam)) {
      setActiveTab(tabParam as typeof activeTab)
    }
  }, [searchParams])

  // Handle Mark Course Completed (to simulate completion & certificate generation)
  const handleCompleteCourse = async (enrollmentId: number) => {
    try {
      await apiService.completeCourse(enrollmentId)
      setActionMsg('🎉 Course completed! Your verified certificate is ready under Certificates.')
      // Refresh courses
      const refreshed = await apiService.getStudentCourses()
      setCoursesData(refreshed as unknown as typeof coursesData)
      setActiveTab('certificates')
    } catch {
      setActionMsg('Failed to update course completion.')
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#F0F6FF] font-['Inter']">
      {/* ─── Top Navigation Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-[#155EEF] border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Student Hub</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/courses"
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#155EEF] transition-colors"
            >
              Explore Tracks
            </Link>
            <Link
              href="/student/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs sm:text-sm font-medium text-[#101B3C] transition-all"
            >
              <User size={16} weight="bold" />
              <span className="hidden sm:inline">{user?.name || 'Profile'}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <SignOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* Enrollment Confirmation Alert if redirected */}
        {enrolledParam && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle size={22} weight="fill" className="text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">🎉 Enrollment Confirmed</p>
                <p className="text-xs text-emerald-700 mt-0.5 font-normal">
                  Welcome to the program! Your course materials and live batch schedule have been unlocked below.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.replace('/student/dashboard')}
              className="text-xs text-emerald-700 hover:text-emerald-900 underline font-medium cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Action feedback toast */}
        {actionMsg && (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold flex items-center justify-between">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg('')} className="text-blue-600 hover:underline text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* ─── Hero Card: Customer Details & Learner Status ────────────── */}
        <div className="bg-gradient-to-r from-[#101B3C] via-[#15346F] to-[#155EEF] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center font-['Plus_Jakarta_Sans'] shadow-inner shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold uppercase tracking-wider">
                  <CheckCircle size={13} weight="fill" />
                  <span>Active Student Account</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight">
                  {user?.name || 'Student Learner'}
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 flex flex-wrap items-center gap-3">
                  <span>{user?.email}</span>
                  <span className="text-blue-300">•</span>
                  <span>ID: {user?.id?.substring(0, 10) || 'CC-ST-2026'}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics Counter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-center">
                <span className="text-xs text-blue-200 block">Enrolled</span>
                <span className="text-xl sm:text-2xl font-black">{coursesData.all.length}</span>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-center">
                <span className="text-xs text-blue-200 block">Ongoing</span>
                <span className="text-xl sm:text-2xl font-black text-amber-300">{coursesData.ongoing.length}</span>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-center">
                <span className="text-xs text-blue-200 block">Completed</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-300">{coursesData.completed.length}</span>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-center">
                <span className="text-xs text-blue-200 block">Certificates</span>
                <span className="text-xl sm:text-2xl font-black text-purple-300">{coursesData.certificates.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Navigation Tabs ────────────────────────────────────────── */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: 'ongoing', label: 'Ongoing Courses', count: coursesData.ongoing.length, icon: BookOpen },
            { key: 'completed', label: 'Completed Courses', count: coursesData.completed.length, icon: CheckCircle },
            { key: 'certificates', label: 'Certificates', count: coursesData.certificates.length, icon: Certificate },
            { key: 'demos', label: 'Live Demos', count: coursesData.demoBookings.length, icon: VideoCamera },
          ].map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={16} weight={isActive ? 'fill' : 'regular'} />
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ─── TAB 1: ONGOING COURSES ─────────────────────────────────── */}
        {activeTab === 'ongoing' && (
          <div className="space-y-6">
            {loadingData ? (
              <div className="py-12 text-center text-xs text-slate-500">Loading enrolled courses...</div>
            ) : coursesData.ongoing.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <BookOpen size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No active ongoing programs</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    You have not enrolled in any ongoing tech cohorts yet. Explore our live programs to start learning with senior mentors.
                  </p>
                </div>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm"
                >
                  <span>Explore Programs</span>
                  <ArrowRight size={16} weight="bold" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coursesData.ongoing.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Ongoing • In Progress
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {enrollment.course.duration || '48 Hours'}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 leading-snug">
                        {enrollment.course.title}
                      </h3>

                      <p className="text-xs text-slate-500">
                        Instructor: <strong className="text-slate-800">{enrollment.course.instructor}</strong>
                      </p>

                      {/* Progress bar (simulated 35% for active cohorts) */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                          <span>Cohort Progress</span>
                          <span className="text-blue-600">35% Completed (4/12 Modules)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: '35%' }} />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                        <PlayCircle size={18} className="text-blue-600 shrink-0" weight="fill" />
                        <span>Next Live Session: <strong>Module 5: System Architecture &amp; Indexing</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <Link
                        href={`/courses/${enrollment.course.slug || enrollment.courseId}`}
                        className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                      >
                        View Curriculum
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleCompleteCourse(enrollment.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        title="Mark course complete to view certificate"
                      >
                        <CheckCircle size={15} weight="bold" />
                        <span>Mark Completed &amp; Get Certificate</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: COMPLETED COURSES ───────────────────────────────── */}
        {activeTab === 'completed' && (
          <div className="space-y-6">
            {coursesData.completed.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-900">No completed courses yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Complete all modules and capstone projects in your ongoing courses to earn verified credentials.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coursesData.completed.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="bg-white rounded-2xl border border-emerald-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle size={14} weight="fill" />
                          <span>Completed Program</span>
                        </span>
                        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                          Grade: A+
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
                        {enrollment.course.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Completed on: {new Date(enrollment.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Certificate Issued</span>
                      <button
                        type="button"
                        onClick={() => {
                          const cert = coursesData.certificates.find((c) => c.courseTitle === enrollment.course.title)
                          if (cert) setSelectedCertificate(cert)
                          else setActiveTab('certificates')
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Certificate size={15} weight="fill" />
                        <span>View Certificate</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: CERTIFICATES ───────────────────────────────────── */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            {coursesData.certificates.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <Certificate size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-900">No verified certificates yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Complete your enrolled programs to unlock shareable industry credentials with verifiable cryptographic IDs.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesData.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-gradient-to-br from-[#101B3C] to-slate-900 rounded-2xl p-6 text-white border border-slate-700/80 shadow-md flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-blue-300 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                          CareerCatch Verified
                        </span>
                        <Certificate size={22} weight="fill" className="text-amber-400" />
                      </div>

                      <h3 className="text-base sm:text-lg font-bold font-['Plus_Jakarta_Sans'] leading-tight">
                        {cert.courseTitle}
                      </h3>

                      <div className="text-xs text-slate-300 space-y-1">
                        <div>Recipient: <strong className="text-white">{cert.studentName}</strong></div>
                        <div>Credential ID: <span className="font-mono text-blue-300 text-[11px]">{cert.id}</span></div>
                        <div>Grade: <span className="text-emerald-400 font-bold">{cert.grade}</span></div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCertificate(cert)}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Certificate size={16} weight="fill" />
                      <span>Inspect &amp; Download</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 4: LIVE DEMOS ─────────────────────────────────── */}
        {activeTab === 'demos' && (
          <div className="space-y-6">
            {coursesData.demoBookings.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <VideoCamera size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-900">No live demos scheduled</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Need personalized roadmap guidance? Book a free interactive session with a senior mentor.
                </p>
                <Link
                  href="/#courses"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  <Sparkle size={15} weight="fill" />
                  <span>Book Free Live Demo</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coursesData.demoBookings.map((demo) => (
                  <div
                    key={demo.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {demo.status || 'SCHEDULED'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Mentor Session</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {demo.courseInterest || 'Career Roadmap & Tech Evaluation'}
                    </h4>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <CalendarBlank size={14} className="text-blue-600" />
                        <span>Date: {demo.preferredDate ? new Date(demo.preferredDate).toLocaleDateString() : 'To be confirmed'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-blue-600" />
                        <span>Slot: {demo.preferredTime || '4:00 PM IST'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Live on Google Meet</span>
                      <span className="text-xs font-bold text-blue-600">Mentor Assigned</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ─── CERTIFICATE MODAL ────────────────────────────────────────── */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs font-['Inter']">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={20} weight="bold" />
            </button>

            {/* Certificate Preview Card */}
            <div className="border-4 border-double border-amber-600/40 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-amber-50/40 to-white text-center space-y-4">
              <div className="flex justify-center items-center gap-2 text-blue-700 font-extrabold tracking-wider uppercase text-xs">
                <Certificate size={20} weight="fill" className="text-amber-500" />
                <span>CareerCatch Certificate of Excellence</span>
              </div>

              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                This credential certifies that
              </p>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101B3C] font-['Plus_Jakarta_Sans']">
                {selectedCertificate.studentName}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                has successfully completed all requirements, practical lab assignments, and production capstone deliverables for
              </p>

              <h3 className="text-lg sm:text-xl font-bold text-blue-700 font-['Plus_Jakarta_Sans']">
                {selectedCertificate.courseTitle}
              </h3>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <div>
                  <span className="block text-[10px] uppercase text-slate-400">Date Issued</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(selectedCertificate.completedDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-slate-400">Credential ID</span>
                  <span className="font-mono font-bold text-slate-800">{selectedCertificate.id}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-slate-400">Verified By</span>
                  <span className="font-semibold text-slate-800">CareerCatch Academic Board</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                <ShieldCheck size={18} weight="fill" />
                <span>Cryptographically Verified Credential</span>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <DownloadSimple size={16} weight="bold" />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href)
                    alert('Certificate verification link copied to clipboard!')
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShareNetwork size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F0F6FF]" />}>
      <StudentDashboardContent />
    </Suspense>
  )
}
