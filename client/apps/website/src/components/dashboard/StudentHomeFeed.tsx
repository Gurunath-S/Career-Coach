'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Star,
  Clock,
  ArrowRight,
  CaretLeft,
  CaretRight,
  GraduationCap,
  PlayCircle,
  PencilSimple,
  Sparkle,
  BookOpen,
  Target,
  TrendUp,
  Fire,
  Lightning,
  Cpu,
  Code,
  Palette,
  ChartLine,
  ShieldCheck,
  Briefcase,
  Buildings,
  Globe,
  Desktop,
  Tag,
  CheckCircle,
  Compass,
  type Icon,
} from '@phosphor-icons/react'
import { COURSES } from '@/lib/constants'
import { apiService } from '@/services/api'
import { useStudentAuth } from '@/context/StudentAuthContext'
import type { Course, StudentProfile } from '@careercatch/shared-types'

interface EnrolledCourseItem {
  id: number
  courseId: number
  status: string
  course: {
    id: number
    title: string
    slug: string
    category: string
    duration: string
    instructor: string
    thumbnail?: string
    price: number
  }
}

interface RecommendationResult {
  type: 'goals' | 'role' | 'popular'
  title: string
  subtitle: string
  badge: string
  icon: Icon
  courses: Course[]
}

// ─── Target Role Recommendation Logic ──────────────────────────────────────────
function computeRoleRecommendations(
  courses: Course[],
  profile: StudentProfile | null
): RecommendationResult {
  // Collect target roles without duplicates
  const targetRoles = Array.from(
    new Set(
      [
        ...(profile?.desiredRoles || []),
        profile?.interestedCourse,
        profile?.currentRole,
      ]
        .map((r) => (r || '').trim())
        .filter(Boolean)
    )
  )

  const primaryRole = targetRoles[0] || ''
  const primaryRoleLower = primaryRole.toLowerCase()

  if (primaryRole) {
    const scored = courses.map((course) => {
      let score = 0
      const title = (course.title || '').toLowerCase()
      const category = (course.category || '').toLowerCase()

      // Primary role exact/fuzzy match
      if (title.includes(primaryRoleLower) || category.includes(primaryRoleLower)) score += 20

      // Domain-specific alignments
      if (primaryRoleLower.includes('cloud') || primaryRoleLower.includes('devops')) {
        if (category.includes('cloud') || title.includes('cloud') || title.includes('aws')) score += 18
        if (category.includes('devops') || title.includes('devops') || title.includes('cicd')) score += 16
      }
      if (
        primaryRoleLower.includes('full stack') ||
        primaryRoleLower.includes('developer') ||
        primaryRoleLower.includes('software')
      ) {
        if (category.includes('full stack') || title.includes('full stack')) score += 18
        if (title.includes('react') || title.includes('node')) score += 12
      }
      if (primaryRoleLower.includes('frontend')) {
        if (category.includes('full stack') || title.includes('react') || title.includes('web')) score += 18
      }
      if (primaryRoleLower.includes('backend')) {
        if (category.includes('full stack') || category.includes('cloud') || title.includes('node')) score += 18
      }
      if (
        primaryRoleLower.includes('data') ||
        primaryRoleLower.includes('machine learning') ||
        primaryRoleLower.includes('ai')
      ) {
        if (category.includes('data') || title.includes('data') || title.includes('machine learning')) score += 18
        if (title.includes('python')) score += 14
      }
      if (primaryRoleLower.includes('design') || primaryRoleLower.includes('ui') || primaryRoleLower.includes('ux')) {
        if (category.includes('design') || category.includes('ui/ux') || title.includes('ui/ux')) score += 20
      }
      if (primaryRoleLower.includes('student') || primaryRoleLower.includes('fresher')) {
        if (course.level === 'Beginner') score += 10
      }

      return { course, score }
    })

    const matchedCourses = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.course)

    if (matchedCourses.length > 0) {
      return {
        type: 'goals',
        title: 'Recommended for You',
        subtitle: `Personalized matches for your career goals in "${primaryRole}"`,
        badge: `Target Role: ${primaryRole}`,
        icon: Target,
        courses: matchedCourses,
      }
    }
  }

  // Fallback if no role matched or specified
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

// ─── Skill Matching Helper ───────────────────────────────────────────────────
function getCourseSkillScore(course: Course, skill: string): number {
  const normSkill = skill.toLowerCase().trim()
  const cTitle = (course.title || '').toLowerCase()
  const cCat = (course.category || '').toLowerCase()
  const cSkills = (course.skills || []).map((s) => s.toLowerCase().trim())

  if (cSkills.some((s) => s.includes(normSkill) || normSkill.includes(s))) {
    return 15
  }
  if (cTitle.includes(normSkill) || cCat.includes(normSkill)) {
    return 12
  }

  const tokens = normSkill
    .split(/[\s,&/()]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !['and', 'with', 'the', 'for'].includes(t))

  let score = 0
  for (const token of tokens) {
    if (cSkills.some((s) => s.includes(token))) score += 6
    if (cTitle.includes(token)) score += 8
    if (cCat.includes(token)) score += 4
  }

  return score
}

// ─── Horizontal Course Cards Row Component ─────────────────────────────────────
function HorizontalCoursesRow({
  title,
  subtitle,
  courses,
  exploreHref,
  exploreLabel,
  skillFilterTags,
  activeSkillTag,
  onSelectSkillTag,
  profileSkills,
}: {
  title: string
  subtitle: string
  courses: Course[]
  exploreHref?: string
  exploreLabel?: string
  skillFilterTags?: string[]
  activeSkillTag?: string
  onSelectSkillTag?: (tag: string) => void
  profileSkills?: string[]
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
          <div className={`hidden sm:flex items-center gap-1.5 ${exploreHref ? 'pl-2 border-l border-slate-200' : ''}`}>
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

      {/* Optional Interactive Skill Filter Pills */}
      {skillFilterTags && skillFilterTags.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {skillFilterTags.map((tag) => {
            const isSelected = (activeSkillTag || 'All Skills') === tag
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectSkillTag?.(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0056D2] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      )}

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

                {/* Course Skills Badges */}
                {course.skills && course.skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                    {course.skills.slice(0, 3).map((sk) => {
                      const isMatchedSkill = profileSkills?.some((ps) =>
                        ps.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(ps.toLowerCase())
                      )
                      return (
                        <span
                          key={sk}
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium transition-colors ${
                            isMatchedSkill
                              ? 'bg-blue-50 text-[#0056D2] font-semibold border border-blue-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {sk}
                        </span>
                      )
                    })}
                    {course.skills.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        +{course.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}
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

// ─── Visual Partner Badge Helper ─────────────────────────────────────────────

const computePersonalizedRecommendations = computeRoleRecommendations;
export function StudentHomeFeed() {
  const router = useRouter()
  const { user } = useStudentAuth()
  const [courses, setCourses] = useState<Course[]>(COURSES)
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [enrolledOngoing, setEnrolledOngoing] = useState<EnrolledCourseItem[]>([])

  useEffect(() => {
    let active = true
    async function loadData() {
      try {
        const [cData, pData, enrolledData] = await Promise.all([
          apiService.getCourses().catch(() => COURSES),
          apiService.getStudentProfile().catch(() => null),
          apiService.getStudentCourses().catch(() => ({ ongoing: [] })),
        ])
        if (active) {
          if (cData && cData.length > 0) setCourses(cData)
          if (pData) setProfile(pData)
          if (enrolledData?.ongoing) setEnrolledOngoing(enrolledData.ongoing as unknown as EnrolledCourseItem[])

          // Redirect to onboarding page if user just logged in
          if (typeof window !== 'undefined' && user?.id) {
            const justLoggedIn = sessionStorage.getItem('careercatch_show_onboarding') === 'true'
            if (justLoggedIn) {
              sessionStorage.removeItem('careercatch_show_onboarding')
              router.push('/onboarding')
            }
          }
        }
      } catch (err) {
        console.error('Failed to load student home feed data:', err)
      }
    }
    loadData()
    return () => {
      active = false
    }
  }, [user])

  // Personalized Recommendation
  const recommendation = computePersonalizedRecommendations(courses, profile)

  // In-Demand Skills Courses
  const inDemandKeywords = ['react', 'next.js', 'python', 'aws', 'docker', 'machine learning', 'figma']
  const inDemandCourses = courses.filter((c) => {
    const title = (c.title || '').toLowerCase()
    const skills = (c.skills || []).map((s) => s.toLowerCase())
    return inDemandKeywords.some((kw) => title.includes(kw) || skills.some((s) => s.includes(kw)))
  })

  const hasSpecificGoal = Boolean(
    profile?.currentRole ||
      profile?.interestedCourse ||
      (profile?.desiredRoles && profile.desiredRoles.length > 0)
  )

  const careerInterest =
    profile?.currentRole || profile?.interestedCourse || profile?.desiredRoles?.[0] || ''

  return (
    <div className="bg-white min-h-screen font-['Inter']">
      {/* ─── Hero Welcome Banner (Solid Brand Blue) ─────────────────────────── */}
      <section className="bg-[#0056D2] text-white py-8 sm:py-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Learner'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-2.5 flex items-center gap-2 flex-wrap">
              <span>Courses tailored to your career goal:</span>
              {hasSpecificGoal && (
                <span className="font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-lg border border-white/25">
                  {careerInterest}
                </span>
              )}
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/25 px-3 py-1 rounded-md transition-colors cursor-pointer"
                title="Edit occupation and interests"
              >
                <PencilSimple size={13} weight="bold" />
                <span>Edit occupation and interests</span>
              </Link>
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* ─── Udemy-Style: "Let's Start Learning" Row (If enrolled in courses) ─── */}
        {enrolledOngoing.length > 0 && (
          <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0056D2] flex items-center justify-center font-bold">
                  <PlayCircle size={18} weight="fill" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                    Let&apos;s start learning
                  </h3>
                  <p className="text-xs text-slate-500">Pick up right where you left off</p>
                </div>
              </div>

              <Link
                href="/my-learning"
                className="text-xs font-bold text-[#0056D2] hover:underline flex items-center gap-1"
              >
                <span>My learning ({enrolledOngoing.length})</span>
                <ArrowRight size={13} weight="bold" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledOngoing.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      In Progress • Active
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.course.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      Mentor: {item.course.instructor} • {item.course.duration}
                    </p>
                  </div>

                  <Link
                    href={`/courses/${item.course.slug}`}
                    className="px-3.5 py-2 rounded-xl bg-[#0056D2] text-white text-xs font-bold hover:bg-[#00419e] shrink-0 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <PlayCircle size={15} weight="bold" />
                    <span>Resume</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── 1. Primary Recommendation Spotlight ───────────────────────────── */}
        <HorizontalCoursesRow
          title={recommendation.title}
          subtitle={recommendation.subtitle}
          courses={recommendation.courses}
          exploreHref="/courses"
          exploreLabel="View Full Track"
        />

        {/* ─── 2. Trending In-Demand Skills Spotlight ────────────────────────── */}
        <HorizontalCoursesRow
          title="Trending In-Demand Skills in Tech"
          subtitle="Top hiring vacancies actively seeking talent in React, Next.js, Python, AWS Cloud & Docker"
          courses={inDemandCourses}
          exploreHref="/courses"
          exploreLabel="Browse In-Demand"
        />

        {/* ─── 3. Solid Blue CTA Banner ────────────────────────────────────────── */}
        <div className="pt-2">
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

    </div>
  )
}
