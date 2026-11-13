'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { apiService } from '@/services/api'
import { Course } from '@careercatch/shared-types'
import { DemoBookingModal } from '@/components/modals/DemoBookingModal'
import {
  Star,
  Clock,
  GraduationCap,
  Users,
  CheckCircle,
  CaretDown,
  CaretUp,
  ShieldCheck,
  Sparkle,
  ArrowRight,
  BookOpen,
} from '@phosphor-icons/react'

const DEFAULT_SYLLABUS = [
  {
    module: 'Module 1: Foundations & Architecture',
    weeks: 'Weeks 1-3',
    topics: [
      'Core Programming Syntax and Modern Standards',
      'Data Structures, Control Flow, and Algorithms',
      'Clean Code, Modular Architecture, and Git Flow',
    ],
  },
  {
    module: 'Module 2: Real-World Implementation',
    weeks: 'Weeks 4-7',
    topics: [
      'Building Interactive Client Applications with State Management',
      'API Design, REST Contracts, and Error Handling',
      'Database Modeling, Migrations, and Relational Schema Design',
    ],
  },
  {
    module: 'Module 3: Production Engineering & Deployment',
    weeks: 'Weeks 8-10',
    topics: [
      'Authentication, Authorization, and Security Hardening',
      'Performance Optimization, Caching, and Core Web Vitals',
      'Cloud Deployment, CI/CD Automation, and Monitoring',
    ],
  },
  {
    module: 'Module 4: Capstone Project & Career Prep',
    weeks: 'Weeks 11-12',
    topics: [
      'Production-Grade Capstone Project Guided by Senior Engineers',
      'Technical Interview Practice and Code Review Simulations',
      'Resume Engineering and Direct Referrals to Hiring Partners',
    ],
  },
]

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0)
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  useEffect(() => {
    async function loadCourse() {
      setLoading(true)
      const data = await apiService.getCourseBySlug(resolvedParams.slug)
      setCourse(data)
      setLoading(false)
    }
    loadCourse()
  }, [resolvedParams.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading course curriculum...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Course Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">The requested program curriculum could not be located.</p>
        <Link
          href="/courses"
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
        >
          Explore All Courses
        </Link>
      </div>
    )
  }

  const syllabus = (course.syllabus as any) || DEFAULT_SYLLABUS

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Hero Header */}
      <section className="bg-[#101B3C] text-white py-14 md:py-20 relative overflow-hidden">
        <div className="container relative z-10 max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
            <Link href="/courses" className="hover:underline">Courses</Link>
            <span>/</span>
            <span>{course.category}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight mb-4">
            {course.title}
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-3xl mb-6 leading-relaxed">
            {course.description ||
              `Master industry-grade ${course.title} through live interactive classes, capstone portfolio projects, and direct 1:1 mentorship from seasoned engineering leaders.`}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Star size={18} weight="fill" />
              <span>{course.rating || 4.8}</span>
              <span className="text-slate-400 font-normal">({course.reviews || 240} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-blue-400" />
              <span>{course.duration || '48 Hours Live'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap size={16} className="text-blue-400" />
              <span>Level: {course.level || 'Beginner to Job Ready'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <div className="container max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Curriculum & Instructor */}
          <div className="lg:col-span-2 space-y-10">
            {/* Key Program Highlights */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 mb-4">
                What You Will Achieve
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Live, interactive code reviews with senior engineering mentors',
                  'Build & deploy 3 production-grade capstone projects for your portfolio',
                  'Dedicated resume review, mock technical interviews, and recruiter referrals',
                  'Lifetime access to session recordings, code templates, and student community',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={20} weight="fill" className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Breakdown */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
                    Comprehensive Curriculum
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Structured modular progression from core principles to production deployment.
                  </p>
                </div>
                <BookOpen size={24} className="text-blue-600" />
              </div>

              <div className="space-y-3">
                {syllabus.map((mod: any, index: number) => {
                  const isOpen = openModuleIndex === index
                  return (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenModuleIndex(isOpen ? null : index)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                      >
                        <div>
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                            {mod.weeks || `Module ${index + 1}`}
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            {mod.module || mod.title}
                          </span>
                        </div>
                        {isOpen ? (
                          <CaretUp size={18} className="text-slate-500" />
                        ) : (
                          <CaretDown size={18} className="text-slate-500" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-white border-t border-slate-200">
                          <ul className="space-y-2">
                            {(mod.topics || []).map((topic: string, tidx: number) => (
                              <li key={tidx} className="flex items-center gap-2 text-xs text-slate-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Instructor Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center overflow-hidden shrink-0">
                {course.instructorAvatar ? (
                  <img src={course.instructorAvatar} alt={course.instructor} className="w-full h-full object-cover" />
                ) : (
                  <Users size={32} className="text-blue-600" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Lead Instructor</span>
                <h3 className="text-lg font-bold text-slate-900">{course.instructor}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Active engineering practitioner with over 8+ years of production experience in scalable cloud architectures. Conducts 100% of live classes and hands-on code reviews.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-lg sticky top-24 space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Admissions Open
                </span>
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-3xl font-extrabold text-slate-900">₹{course.price.toLocaleString()}</span>
                  <span className="text-base text-slate-400 line-through">₹{course.originalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Inclusive of live classes, mentorship & certification</p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkle size={16} weight="fill" />
                  <span>Book Free 1:1 Live Demo</span>
                </button>

                <a
                  href="#enquiry"
                  onClick={() => {
                    const el = document.getElementById('enquiry')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Request Detailed Syllabus (PDF)</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                  <span>7-Day 100% money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-500 shrink-0" />
                  <span>0% interest EMI options available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-500 shrink-0" />
                  <span>Verified industry certificate of completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DemoBookingModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        initialCourse={course.title}
      />
    </div>
  )
}
