"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Star,
  Clock,
  ArrowRight,
  GraduationCap,
  Sparkle,
  Code,
  Laptop,
} from '@phosphor-icons/react'
import { COURSES } from '@/lib/constants'
import { apiService } from '@/services/api'
import type { Course } from '@careercatch/shared-types'
import { DemoBookingModal } from '@/components/modals/DemoBookingModal'

const TRACK_FILTERS = [
  { label: 'All Programs', key: 'all' },
  { label: 'Full Stack Web', key: 'Full Stack' },
  { label: 'Data Science & AI', key: 'Data Science' },
  { label: 'UI/UX Design', key: 'UI/UX Design' },
  { label: 'Cloud & DevOps', key: 'Cloud' },
]

interface PopularCoursesProps {
  hideHeader?: boolean
}

export default function PopularCourses({ hideHeader = false }: PopularCoursesProps) {
  const [courses, setCourses] = useState<Course[]>(COURSES)
  const [activeFilter, setActiveFilter] = useState('all')
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  // Fetch live courses from database
  useEffect(() => {
    let active = true
    async function loadCourses() {
      try {
        const data = await apiService.getCourses()
        if (active && data && data.length > 0) {
          setCourses(data)
        }
      } catch (err) {
        console.error('Failed to load DB courses in PopularCourses:', err)
      }
    }
    loadCourses()
    return () => {
      active = false
    }
  }, [])

  // All courses in the selected track
  const allFilteredCourses =
    activeFilter === 'all'
      ? courses
      : courses.filter((c) =>
          c.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
          (activeFilter === 'Cloud' && (c.category.includes('Cloud') || c.category.includes('DevOps')))
        )

  // Show limited courses on homepage: max 6 for all, max 4 for specific tracks
  const displayLimit = activeFilter === 'all' ? 6 : 4
  const displayedCourses = allFilteredCourses.slice(0, displayLimit)

  // Sector-specific destination URL
  const viewAllHref =
    activeFilter === 'all'
      ? '/courses'
      : `/courses?category=${encodeURIComponent(activeFilter)}`
  const activeSectorName =
    TRACK_FILTERS.find((t) => t.key === activeFilter)?.label || activeFilter

  return (
    <section
      id="courses"
      className={
        hideHeader
          ? 'pt-2 pb-6 bg-transparent relative'
          : 'py-16 md:py-24 bg-white border-b border-slate-200/80 relative'
      }
    >
      <div className={hideHeader ? 'w-full' : 'container'}>
        {/* Section Header: Pure CSS Grid (Hidden for logged-in student dashboard) */}
        {!hideHeader && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-10 pb-6 border-b border-slate-100">
            <div className="md:col-span-8">
              <span className="inline-grid grid-flow-col items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wider uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>INDUSTRY-ALIGNED PROGRAMS</span>
              </span>

              <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight">
                Explore Industry-Aligned Programs
              </h2>

              <p className="font-['Inter'] text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Curricula designed and taught by active practitioners at Google, Microsoft, and Amazon. Learn by shipping real software.
              </p>
            </div>

            <div className="md:col-span-4 md:justify-self-end flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                className="grid grid-flow-col items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-700 text-xs sm:text-sm font-bold transition-all shadow-2xs group cursor-pointer"
              >
                <span>Talk to an Academic Advisor</span>
                <ArrowRight
                  size={15}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
              <Link
                href={viewAllHref}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#0056D2] hover:underline whitespace-nowrap"
              >
                <span>{activeFilter === 'all' ? 'View All 12+ Programs' : `View All ${activeSectorName}`}</span>
                <ArrowRight size={12} weight="bold" />
              </Link>
            </div>
          </div>
        )}

        {/* Filter Bar: Pure CSS Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mb-10">
          {TRACK_FILTERS.map((tab) => {
            const isActive = activeFilter === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={`grid place-items-center py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-blue-700 text-white border-blue-700 shadow-md shadow-blue-700/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90'
                }`}
              >
                <span className="truncate">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Course Cards Grid: Limited to top curated programs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedCourses.map((course) => (
            <div
              key={course.id}
              className="grid grid-rows-[auto_1fr] rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all duration-200 group"
            >
              {/* Thumbnail Container */}
              <Link href={`/courses/${course.slug || course.id}`} className="relative aspect-16/10 overflow-hidden bg-slate-100 block">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Overlaid Badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 grid grid-flow-col items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold shadow-xs border border-white/60">
                  <Code size={12} weight="bold" className="text-blue-600" />
                  <span>{course.category}</span>
                </div>

                <div className="absolute top-3 right-3 grid grid-flow-col items-center gap-1 px-2.5 py-1 rounded-full bg-[#0056D2]/90 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
                  <span>Specialization</span>
                </div>
              </Link>

              {/* Card Content: Pure CSS Grid Rows */}
              <div className="grid grid-rows-[auto_auto_auto_1fr_auto] p-5 gap-3.5">
                {/* Title */}
                <div>
                  <Link href={`/courses/${course.slug || course.id}`}>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-blue-700 transition-colors tracking-tight line-clamp-1">
                      {course.title}
                    </h3>
                  </Link>
                </div>

                {/* Instructor Row: Pure 2-Column Grid */}
                <div className="grid grid-cols-[auto_1fr] items-center gap-2.5">
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructor}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div className="grid">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {course.instructor}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium leading-tight">
                      Senior Industry Mentor
                    </span>
                  </div>
                </div>

                {/* Stats Row: Pure 3-Column Equal Grid */}
                <div className="grid grid-cols-3 items-center divide-x divide-slate-200/80 bg-slate-50/90 rounded-xl p-2.5 text-center text-xs border border-slate-200/60">
                  <div className="grid place-items-center">
                    <span className="grid grid-flow-col items-center gap-1 font-bold text-slate-900">
                      <Star size={13} weight="fill" className="text-amber-500" />
                      {course.rating}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {course.reviews} reviews
                    </span>
                  </div>

                  <div className="grid place-items-center">
                    <span className="grid grid-flow-col items-center gap-1 font-bold text-slate-900">
                      <Clock size={13} className="text-blue-600" />
                      {course.duration}
                    </span>
                    <span className="text-[10px] text-slate-500">Duration</span>
                  </div>

                  <div className="grid place-items-center">
                    <span className="grid grid-flow-col items-center gap-1 font-bold text-slate-900">
                      <GraduationCap size={13} className="text-indigo-600" />
                      {course.level}
                    </span>
                    <span className="text-[10px] text-slate-500">Level</span>
                  </div>
                </div>

                {/* Curriculum Bullet Points */}
                <div className="grid gap-1.5 py-1">
                  {[
                    'Practical project-based curriculum',
                    'Production capstone code portfolio',
                    'Direct hiring partner referrals',
                  ].map((feat, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[auto_1fr] items-center gap-2 text-xs text-slate-600"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Action Row: Pure 2-Column Grid */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-3 pt-3.5 border-t border-slate-100">
                  <div className="grid">
                    <div className="grid grid-flow-col items-baseline justify-start gap-1.5">
                      <span className="font-['Plus_Jakarta_Sans'] text-lg font-black text-slate-900">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{course.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">
                      Save ₹{(course.originalPrice - course.price).toLocaleString('en-IN')} (50% Off)
                    </span>
                  </div>

                  <Link
                    href={`/courses/${course.slug || course.id}`}
                    className="grid grid-flow-col items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-blue-700/20 transition-all cursor-pointer"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight size={13} weight="bold" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Sector CTA Banner */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-slate-50 to-blue-50/50 border border-blue-200/80 shadow-2xs">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900">
              {activeFilter === 'all'
                ? `Showing ${displayedCourses.length} of ${allFilteredCourses.length} industry-leading programs`
                : `Showing ${displayedCourses.length} of ${allFilteredCourses.length} programs in ${activeSectorName}`}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore the complete curriculum, projects, and specializations in this sector.
            </p>
          </div>

          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all shrink-0 group cursor-pointer"
          >
            <span>
              {activeFilter === 'all'
                ? `Explore All ${allFilteredCourses.length} Programs`
                : `Explore All ${allFilteredCourses.length} ${activeSectorName} Programs`}
            </span>
            <ArrowRight size={15} weight="bold" className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Section Bottom Feature Pillars: Pure 4-Column CSS Grid (Hidden for student dashboard) */}
        {!hideHeader && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-100">
          <div className="grid grid-flow-col items-center justify-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 grid place-items-center shrink-0">
              <Laptop size={18} weight="fill" />
            </div>
            <div className="grid">
              <strong className="text-xs font-bold text-slate-900 leading-tight">Practical Learning</strong>
              <span className="text-[11px] text-slate-500">Hands-on exercises</span>
            </div>
          </div>

          <div className="grid grid-flow-col items-center justify-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center shrink-0">
              <Code size={18} weight="fill" />
            </div>
            <div className="grid">
              <strong className="text-xs font-bold text-slate-900 leading-tight">Real Capstones</strong>
              <span className="text-[11px] text-slate-500">Production codebases</span>
            </div>
          </div>

          <div className="grid grid-flow-col items-center justify-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 grid place-items-center shrink-0">
              <Sparkle size={18} weight="fill" />
            </div>
            <div className="grid">
              <strong className="text-xs font-bold text-slate-900 leading-tight">Senior Mentorship</strong>
              <span className="text-[11px] text-slate-500">Direct mentor feedback</span>
            </div>
          </div>

          <div className="grid grid-flow-col items-center justify-start gap-3 p-3.5 rounded-xl bg-amber-100/60 text-amber-800 border border-amber-200/60">
            <div className="w-9 h-9 rounded-lg bg-amber-200/70 text-amber-800 grid place-items-center shrink-0">
              <GraduationCap size={18} weight="fill" />
            </div>
            <div className="grid">
              <strong className="text-xs font-bold text-slate-900 leading-tight">Placement Support</strong>
              <span className="text-[11px] text-slate-600">200+ Hiring partners</span>
            </div>
          </div>
        </div>
        )}
      </div>

      <DemoBookingModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </section>
  )
}
