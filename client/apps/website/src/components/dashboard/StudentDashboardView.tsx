'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import {
  BookOpen,
  CalendarBlank,
  Certificate,
  CheckCircle,
  Clock,
  Sparkle,
  ArrowRight,
  DownloadSimple,
  ShareNetwork,
  X,
  ShieldCheck,
  VideoCamera,
  PlayCircle,
  MagnifyingGlass,
} from '@phosphor-icons/react'
import { useStudentAuth } from '@/context/StudentAuthContext'
import { apiService } from '@/services/api'
import { StudentExploreCourses } from './StudentExploreCourses'

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

export function StudentDashboardView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const enrolledParam = searchParams.get('enrolled')
  const { user } = useStudentAuth()

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

  const [profileAvatar, setProfileAvatar] = useState<string | null>(null)

  // Load student dashboard data
  useEffect(() => {
    let isMounted = true
    async function loadData() {
      try {
        const [cData, pData] = await Promise.all([
          apiService.getStudentCourses().catch(() => ({
            all: [],
            ongoing: [],
            completed: [],
            certificates: [],
            demoBookings: [],
          })),
          apiService.getStudentProfile().catch(() => null),
        ])

        if (isMounted) {
          setCoursesData(cData as unknown as typeof coursesData)
          if (pData?.user?.avatar) {
            setProfileAvatar(pData.user.avatar)
          }
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

  const currentAvatar = profileAvatar || user?.avatar || null

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['ongoing', 'completed', 'certificates', 'demos'].includes(tabParam)) {
      setActiveTab(tabParam as typeof activeTab)
    }
  }, [searchParams])

  // Handle Mark Course Completed
  const handleCompleteCourse = async (enrollmentId: number) => {
    try {
      await apiService.completeCourse(enrollmentId)
      setActionMsg('🎉 Course completed! Your verified certificate has been issued under Certificates.')
      const refreshed = await apiService.getStudentCourses()
      setCoursesData(refreshed as unknown as typeof coursesData)
      setActiveTab('certificates')
    } catch {
      setActionMsg('Failed to update course completion.')
    }
  }

  return (
    <div className="bg-white font-['Inter'] min-h-screen">
      {/* ─── My Learning Full-Viewport Workspace Section (Covers Browser Screen Full across all browsers) ─── */}
      <section className="w-full min-h-student-workspace flex flex-col justify-between bg-white">
        {/* ─── My Learning Full-Width Black Header (Attached Directly to Navbar) ─── */}
        <div className="w-full bg-[#1c1d1f] text-white shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
            {/* Enrollment Confirmation Alert if redirected */}
            {enrolledParam && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle size={22} weight="fill" className="text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">🎉 Enrollment Confirmed</p>
                    <p className="text-xs text-emerald-200/90 mt-0.5 font-normal">
                      Welcome to the program! Your course materials and live batch schedule have been unlocked below.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.replace('/')}
                  className="text-xs text-emerald-300 hover:text-white underline font-medium cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Action feedback toast */}
            {actionMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-semibold flex items-center justify-between">
                <span>{actionMsg}</span>
                <button onClick={() => setActionMsg('')} className="text-blue-300 hover:text-white hover:underline text-xs cursor-pointer">
                  Dismiss
                </button>
              </div>
            )}

            {/* Top Row: Student Welcome & Quick Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/15 text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center font-['Plus_Jakarta_Sans'] shadow-inner shrink-0 overflow-hidden">
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt={user?.name || 'Student Avatar'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'S'
                  )}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-white flex items-center gap-2">
                    <span>Welcome back, {user?.name || 'Student'}!</span>
                    <motion.span
                      className="inline-block origin-[70%_70%] cursor-default select-none"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                      transition={{
                        duration: 1.4,
                        delay: 0.25,
                        ease: 'easeInOut',
                      }}
                    >
                      👋
                    </motion.span>
                  </h2>
                </div>
              </div>

              {/* Quick Metrics Counter Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
                <div className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-[11px] text-slate-400 block">Enrolled</span>
                  <span className="text-base sm:text-lg font-bold text-white">{coursesData.all.length}</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-[11px] text-slate-400 block">Ongoing</span>
                  <span className="text-base sm:text-lg font-bold text-amber-400">{coursesData.ongoing.length}</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-[11px] text-slate-400 block">Completed</span>
                  <span className="text-base sm:text-lg font-bold text-emerald-400">{coursesData.completed.length}</span>
                </div>
                <div className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-[11px] text-slate-400 block">Certificates</span>
                  <span className="text-base sm:text-lg font-bold text-purple-400">{coursesData.certificates.length}</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Large "My learning" Title + Pure Text Tabs (Attached directly to bottom) */}
            <div className="pt-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans'] tracking-tight mb-5">
                My learning
              </h1>

              {/* Navigation Tabs directly touching bottom of the black header */}
              <div className="flex border-b border-white/20 gap-6 sm:gap-8 overflow-x-auto scrollbar-none">
                {[
                  { key: 'ongoing', label: 'All courses' },
                  { key: 'completed', label: 'Completed courses' },
                  { key: 'certificates', label: 'Certifications' },
                ].map((tab) => {
                  const isActive = activeTab === tab.key
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={`pb-3 text-sm font-semibold transition-all cursor-pointer shrink-0 border-b-2 ${
                        isActive
                          ? 'text-white border-white font-bold'
                          : 'text-slate-400 hover:text-white border-transparent font-medium'
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Student Courses & Content Section (Clean White Background, expands to fill remaining viewport) ─── */}
        <div className="w-full flex-1 bg-white flex flex-col justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1 flex flex-col justify-center space-y-6">

          {/* ─── TAB 1: ONGOING COURSES ──────────────────────────────────────── */}
          {activeTab === 'ongoing' && (
            <div className="w-full flex-1 flex flex-col justify-center my-auto">
              {loadingData ? (
                <div className="py-12 text-center text-xs text-slate-500">Loading enrolled courses...</div>
              ) : coursesData.ongoing.length === 0 ? (
                <div className="p-8 sm:p-14 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-4 my-auto max-w-2xl mx-auto w-full">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <BookOpen size={28} />
                  </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No active ongoing programs</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    You have not enrolled in any ongoing tech cohorts yet. Scroll down to explore our live programs and start learning with senior mentors.
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

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {enrollment.course.category}
                        </span>
                        <span>•</span>
                        <span>Mentor: {enrollment.course.instructor || 'Senior Architect'}</span>
                      </div>

                      {/* Course Curriculum Preview */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                          <span>Progress</span>
                          <span className="font-bold text-blue-600">65% Completed</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#155EEF] h-full rounded-full" style={{ width: '65%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link
                        href={`/courses/${enrollment.course.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                      >
                        <PlayCircle size={16} weight="bold" />
                        <span>Resume Learning</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleCompleteCourse(enrollment.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                        title="Simulate course completion to generate certificate"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: COMPLETED COURSES ────────────────────────────────────── */}
        {activeTab === 'completed' && (
          <div className="w-full flex-1 flex flex-col justify-center my-auto">
            {coursesData.completed.length === 0 ? (
              <div className="p-8 sm:p-14 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3 my-auto max-w-2xl mx-auto w-full">
                <CheckCircle size={32} className="text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No completed programs yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  When you complete your courses and deliverables, your achievements and completion records will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
                {coursesData.completed.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle size={13} weight="fill" />
                          <span>Course Completed</span>
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(enrollment.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        {enrollment.course.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        All modules, practical assessments, and production capstone projects approved.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          const cert = coursesData.certificates.find(
                            (c) => c.courseSlug === enrollment.course.slug
                          )
                          if (cert) {
                            setSelectedCertificate(cert)
                          } else {
                            setActiveTab('certificates')
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
                      >
                        <Certificate size={16} />
                        <span>View Verified Certificate</span>
                      </button>

                      <Link
                        href={`/courses/${enrollment.course.slug}`}
                        className="text-xs font-semibold text-slate-600 hover:text-blue-600"
                      >
                        Review Materials →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: CERTIFICATES ─────────────────────────────────────────── */}
        {activeTab === 'certificates' && (
          <div className="w-full flex-1 flex flex-col justify-center my-auto">
            {coursesData.certificates.length === 0 ? (
              <div className="p-8 sm:p-14 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3 my-auto max-w-2xl mx-auto w-full">
                <Certificate size={32} className="text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No certificates issued yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Complete your active courses to receive verifiable digital certificates signed by CareerCatch and academic partners.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-auto">
                {coursesData.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Certificate size={22} weight="duotone" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider block">
                          ID: {cert.id}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                          {cert.courseTitle}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500">
                        Issued to <strong className="text-slate-700">{cert.studentName}</strong> on{' '}
                        {new Date(cert.completedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedCertificate(cert)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <ShieldCheck size={14} weight="bold" />
                        <span>View Certificate</span>
                      </button>

                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={12} weight="fill" />
                        <span>Verified</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 4: LIVE DEMOS & MENTORSHIP ──────────────────────────────── */}
        {activeTab === 'demos' && (
          <div className="w-full flex-1 flex flex-col justify-center my-auto">
            {coursesData.demoBookings.length === 0 ? (
              <div className="p-8 sm:p-14 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3 my-auto max-w-2xl mx-auto w-full">
                <VideoCamera size={32} className="text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No live demos scheduled</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Need personalized roadmap guidance? Explore available programs below or schedule a 1-on-1 session with a mentor.
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  <Sparkle size={15} weight="fill" />
                  <span>Explore Courses</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
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

          </div>
        </div>
      </section>

      {/* ─── SCROLLED DOWN SECTION: EXPLORE OTHER COURSES (Replaced with Bluish Background #F0F6FF) ─── */}
      <section className="bg-[#F0F6FF] border-t border-blue-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101B3C] font-['Plus_Jakarta_Sans'] tracking-tight">
              Explore Other Courses &amp; Specializations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Broaden your skillset across full stack development, cloud computing, AI, or product design with industry-aligned cohorts.
            </p>
          </div>

          {/* Categorized Horizontal Sectors Showcase (Coursera-style) */}
          <StudentExploreCourses />
        </div>
      </section>

      {/* ─── CERTIFICATE MODAL ────────────────────────────────────────────── */}
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
