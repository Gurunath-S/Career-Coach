'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Star,
  Clock,
  ArrowRight,
  CaretLeft,
  CaretRight,
  GraduationCap,
  Target,
  TrendUp,
  Fire,
  type Icon,
} from '@phosphor-icons/react'
import { COURSES } from '@/lib/constants'
import { apiService } from '@/services/api'
import type { Course, StudentProfile } from '@careercatch/shared-types'

interface RecommendationResult {
  type: 'goals' | 'role' | 'popular'
  title: string
  subtitle: string
  badge: string
  icon: Icon
  courses: Course[]
}

// ─── Personalized Recommendation Logic ──────────────────────────────────────────
function computePersonalizedRecommendations(
  courses: Course[],
  profile: StudentProfile | null
): RecommendationResult {
  const interestedCourse = (profile?.interestedCourse || '').toLowerCase().trim()
  const desiredRoles = (profile?.desiredRoles || []).map((r) => r.toLowerCase().trim()).filter(Boolean)
  const desiredSkills = (profile?.skills || []).map((s) => s.toLowerCase().trim()).filter(Boolean)
  const currentRole = (profile?.currentRole || '').toLowerCase().trim()

  const hasSpecificInterests =
    Boolean(interestedCourse) || desiredRoles.length > 0 || desiredSkills.length > 0

  // 1. Match based on Interested Course, Desired Roles, Desired Skills
  if (hasSpecificInterests) {
    const scored = courses.map((course) => {
      let score = 0
      const title = (course.title || '').toLowerCase()
      const category = (course.category || '').toLowerCase()
      const cSkills = (course.skills || []).map((s) => s.toLowerCase())

      // Interested Course match (high weight)
      if (interestedCourse) {
        if (title.includes(interestedCourse) || interestedCourse.includes(title)) score += 20
        else if (category.includes(interestedCourse) || interestedCourse.includes(category)) score += 12
      }

      // Desired Roles match
      for (const role of desiredRoles) {
        if (title.includes(role) || category.includes(role)) score += 12
        if (role.includes('full stack') && (category.includes('full stack') || title.includes('react') || title.includes('web'))) score += 10
        if (role.includes('data') && (category.includes('data') || title.includes('python') || title.includes('machine learning'))) score += 10
        if (role.includes('devops') && (category.includes('devops') || category.includes('cloud') || title.includes('aws'))) score += 10
        if (role.includes('design') && (category.includes('design') || category.includes('ui/ux'))) score += 10
      }

      // Desired Skills match
      for (const skill of desiredSkills) {
        if (cSkills.some((cs) => cs.includes(skill) || skill.includes(cs))) score += 6
        if (title.includes(skill)) score += 8
      }

      return { course, score }
    })

    const matchedCourses = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.course)

    if (matchedCourses.length > 0) {
      const criteria: string[] = []
      const uniqueRoles = Array.from(
        new Set(
          [profile?.interestedCourse, ...(profile?.desiredRoles || [])]
            .map((r) => (r || '').trim())
            .filter(Boolean)
        )
      )
      if (uniqueRoles.length > 0) {
        criteria.push(`"${uniqueRoles.slice(0, 2).join(', ')}"`)
      }
      if (profile?.skills?.length) {
        criteria.push(profile.skills.slice(0, 3).join(', '))
      }

      return {
        type: 'goals',
        title: 'Recommended for You',
        subtitle: `Personalized matches for your selected goals in ${criteria.join(' • ')}`,
        badge: 'Recommended for Your Goals',
        icon: Target,
        courses: matchedCourses,
      }
    }
  }

  // 2. Fallback: If no interests, but has Current Role
  if (currentRole) {
    const roleMatched = courses.filter((c) => {
      const title = (c.title || '').toLowerCase()
      const cat = (c.category || '').toLowerCase()
      return (
        title.includes(currentRole) ||
        cat.includes(currentRole) ||
        (currentRole.includes('frontend') && (cat.includes('full stack') || title.includes('react'))) ||
        (currentRole.includes('backend') && (cat.includes('full stack') || cat.includes('cloud'))) ||
        (currentRole.includes('developer') && cat.includes('full stack')) ||
        (currentRole.includes('student') && c.level === 'Beginner')
      )
    })

    if (roleMatched.length > 0) {
      return {
        type: 'role',
        title: `Recommended for Your Role: ${profile?.currentRole}`,
        subtitle: `Next-level engineering programs to help you upskill and advance from ${profile?.currentRole}`,
        badge: 'Based on Current Role',
        icon: TrendUp,
        courses: roleMatched,
      }
    }
  }

  // 3. Fallback: If user entered none of the data, return Popular Programs by ratings & reviews
  const sortedPopular = courses.slice().sort((a, b) => {
    const aWeight = (a.rating || 4.5) * (a.reviews || 10)
    const bWeight = (b.rating || 4.5) * (b.reviews || 10)
    return bWeight - aWeight
  })

  return {
    type: 'popular',
    title: 'Most Popular & Trending Programs',
    subtitle: 'Highest-rated programs chosen by 10,000+ learners across top tech companies',
    badge: 'Popular by Student Reviews & Enrollments',
    icon: Fire,
    courses: sortedPopular,
  }
}

// ─── Horizontal Course Cards Row Component ─────────────────────────────────────
function HorizontalCoursesRow({
  title,
  subtitle,
  courses,
  exploreHref,
  exploreLabel,
}: {
  title: string
  subtitle: string
  courses: Course[]
  exploreHref?: string
  exploreLabel?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  useEffect(() => {
    updateScrollButtons()
    window.addEventListener('resize', updateScrollButtons)
    return () => window.removeEventListener('resize', updateScrollButtons)
  }, [courses])

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 340 * 2
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (courses.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-blue-100">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Action Controls: View All Link + Horizontal Scroll Buttons */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          {exploreHref && (
            <Link
              href={exploreHref}
              className="text-xs font-bold text-[#0056D2] hover:text-[#00419e] hover:underline flex items-center gap-1 transition-colors"
            >
              <span>{exploreLabel || 'Explore More'}</span>
              <ArrowRight size={13} weight="bold" />
            </Link>
          )}

          {/* Scroll Navigation Chevrons */}
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-xs'
                  : 'border-slate-200 bg-slate-100/60 text-slate-300 cursor-not-allowed'
              }`}
              title="Scroll left"
              aria-label="Scroll left"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-xs'
                  : 'border-slate-200 bg-slate-100/60 text-slate-300 cursor-not-allowed'
              }`}
              title="Scroll right"
              aria-label="Scroll right"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Row of Course Cards */}
      <div
        ref={scrollRef}
        onScroll={updateScrollButtons}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth snap-x"
      >
        {courses.map((course) => (
          <div
            key={course.id}
            className="w-[270px] sm:w-[310px] shrink-0 snap-start bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
          >
            <div>
              {/* Thumbnail with overlay tags */}
              <Link
                href={`/courses/${course.slug || course.id}`}
                className="relative aspect-16/10 overflow-hidden bg-slate-100 block"
              >
                <img
                  src={course.thumbnail || '/images/courses/fullstack-web.jpg'}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Top Tags */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-bold shadow-xs border border-white/60">
                  <GraduationCap size={12} weight="bold" className="text-blue-600" />
                  <span>{course.category}</span>
                </div>

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0056D2]/90 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
                  <span>Specialization</span>
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-4 space-y-2.5">
                <Link href={`/courses/${course.slug || course.id}`} className="block">
                  <h4 className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#0056D2] transition-colors leading-snug line-clamp-2 min-h-[2.5rem]">
                    {course.title}
                  </h4>
                </Link>

                {/* Instructor Row */}
                <div className="flex items-center gap-2">
                  <img
                    src={course.instructorAvatar || '/images/faculty/ravi-kumar.jpg'}
                    alt={course.instructor}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-100 shrink-0"
                  />
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {course.instructor}
                  </span>
                </div>

                {/* Rating & Duration */}
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star size={13} weight="fill" />
                    <span>{course.rating || 4.8}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    <span>{course.duration || '48 Hours'}</span>
                  </span>
                  <span>•</span>
                  <span className="text-[11px] font-medium text-slate-400 capitalize">
                    {course.level || 'Beginner'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer: Pricing & Action */}
            <div className="p-4 pt-3 border-t border-slate-100/80 bg-slate-50/60 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs text-slate-400 block line-through">
                  ₹{course.originalPrice?.toLocaleString('en-IN') || '9,999'}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                  ₹{course.price?.toLocaleString('en-IN') || '4,999'}
                </span>
              </div>

              <Link
                href={`/courses/${course.slug || course.id}`}
                className="px-3 py-1.5 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
              >
                <span>View Program</span>
                <ArrowRight size={13} weight="bold" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main StudentExploreCourses Component ──────────────────────────────────────
export function StudentExploreCourses() {
  const [courses, setCourses] = useState<Course[]>(COURSES)
  const [profile, setProfile] = useState<StudentProfile | null>(null)

  useEffect(() => {
    let active = true
    async function loadData() {
      try {
        const [cData, pData] = await Promise.all([
          apiService.getCourses().catch(() => COURSES),
          apiService.getStudentProfile().catch(() => null),
        ])
        if (active) {
          if (cData && cData.length > 0) setCourses(cData)
          if (pData) setProfile(pData)
        }
      } catch (err) {
        console.error('Failed to load courses or profile for exploration:', err)
      }
    }
    loadData()
    return () => {
      active = false
    }
  }, [])

  // 1. Compute Personalized / Fallback Recommendations
  const recommendation = computePersonalizedRecommendations(courses, profile)

  // 2. Identify In-Demand Skills Courses (courses teaching high in-demand technologies)
  const inDemandKeywords = ['react', 'next.js', 'python', 'aws', 'docker', 'machine learning', 'figma']
  const inDemandCourses = courses.filter((c) => {
    const title = (c.title || '').toLowerCase()
    const skills = (c.skills || []).map((s) => s.toLowerCase())
    return inDemandKeywords.some((kw) => title.includes(kw) || skills.some((s) => s.includes(kw)))
  })

  return (
    <div className="space-y-10">
      {/* ─── 1. Primary Recommendation Spotlight (Personalized or Popular) ─── */}
      <HorizontalCoursesRow
        title={recommendation.title}
        subtitle={recommendation.subtitle}
        courses={recommendation.courses}
        exploreHref="/courses"
        exploreLabel="View Catalog"
      />

      {/* ─── 2. In-Demand Skills Spotlight ─── */}
      <HorizontalCoursesRow
        title="Trending In-Demand Skills in Tech"
        subtitle="Top hiring vacancies actively seeking talent in React, Next.js, Python, AWS Cloud & Docker"
        courses={inDemandCourses}
        exploreHref="/courses"
        exploreLabel="Browse In-Demand"
      />

      {/* ─── 4. Last Segment: View All Courses Full Banner CTA ─────────────── */}
      <div className="pt-4">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0056D2] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight">
              Looking for another specialization or course?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Explore our full curriculum catalog across web engineering, data intelligence, cloud architecture, and product design with senior faculty mentors.
            </p>
          </div>
          <Link
            href="/courses"
            className="px-6 py-3 rounded-xl bg-white text-[#0056D2] hover:bg-blue-50 font-extrabold text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>View All Courses (12+)</span>
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  )
}
