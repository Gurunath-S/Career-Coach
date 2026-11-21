'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { apiService } from '@/services/api'
import { Course } from '@careercatch/shared-types'
import { COURSES } from '@/lib/constants'
import { DemoBookingModal } from '@/components/modals/DemoBookingModal'
import { AuthModal } from '@/components/modals/AuthModal'
import { useStudentAuth } from '@/context/StudentAuthContext'
import {
  Star,
  Clock,
  Users,
  CheckCircle,
  CaretDown,
  CaretUp,
  ShieldCheck,
  ArrowRight,
  Code,
  Laptop,
  Certificate,
  Globe,
  DeviceMobile,
  Check,
  Play,
  ShareNetwork,
  Gift,
  Tag,
  Heart,
  FileText,
  DownloadSimple,
  Infinity as InfinityIcon,
  X,
  Copy,
  Question,
  Buildings,
  GraduationCap,
  Sparkle,
  VideoCamera,
} from '@phosphor-icons/react'

interface LectureItem {
  id: string
  title: string
  duration: string
  preview: boolean
  description: string
}

interface SyllabusSection {
  module: string
  weeks?: string
  duration?: string
  lecturesCount?: number
  exercise?: string
  topics?: string[]
  lectures: LectureItem[]
}

const DEFAULT_SYLLABUS: SyllabusSection[] = [
  {
    module: 'Section 1: Foundations, Architecture & Modern Tooling',
    weeks: 'Weeks 1-3',
    duration: '3h 45m',
    lecturesCount: 6,
    exercise: 'Build a modular CLI state-driven task runner from scratch.',
    lectures: [
      {
        id: 's1-l1',
        title: '1. Course Orientation, Prerequisites & Setup',
        duration: '08:24',
        preview: true,
        description:
          'Understand the end-to-end curriculum roadmap, install Node.js, Git, Docker, and configure VS Code with professional ESLint and Prettier setups.',
      },
      {
        id: 's1-l2',
        title: '2. Core Programming Syntax & Modern ECMAScript Standards',
        duration: '14:15',
        preview: true,
        description:
          'Deep dive into ESNext syntax, closures, prototypes, asynchronous JavaScript (Promises, async/await), and TypeScript type annotations.',
      },
      {
        id: 's1-l3',
        title: '3. Data Structures, Memory Management & Algorithmic Thinking',
        duration: '22:40',
        preview: false,
        description:
          'Analyze space and time complexity (Big-O), memory allocation, stack vs heap, arrays, linked lists, hashmaps, and algorithmic problem-solving techniques.',
      },
      {
        id: 's1-l4',
        title: '4. Clean Code Principles, Modular File Structure & Monorepos',
        duration: '18:50',
        preview: false,
        description:
          'Learn separation of concerns, SOLID principles, code smell detection, domain-driven directory structures, and scalable repository patterns.',
      },
      {
        id: 's1-l5',
        title: '5. Git Workflows, Branching Strategies & Conventional Commits',
        duration: '12:35',
        preview: true,
        description:
          'Master trunk-based development, feature branch rebasing, writing semantic conventional commit messages, and creating professional GitHub pull requests.',
      },
      {
        id: 's1-l6',
        title: '6. Hands-On Lab: Building an Interactive CLI State Engine',
        duration: '28:10',
        preview: false,
        description:
          'Apply Section 1 fundamentals by architecting an interactive command-line interface with persistent JSON state, file I/O streams, and automated unit test assertions.',
      },
    ],
  },
  {
    module: 'Section 2: Real-World Implementation & Full Stack APIs',
    weeks: 'Weeks 4-7',
    duration: '4h 30m',
    lecturesCount: 6,
    exercise: 'Design and deploy a full CRUD REST API with live PostgreSQL database.',
    lectures: [
      {
        id: 's2-l1',
        title: '7. Architecture Deep Dive: Client vs Server Rendering',
        duration: '16:10',
        preview: true,
        description:
          'Examine monolithic, modular, and microservice rendering paradigms, comparing Client-Side Rendering (CSR), Server-Side Rendering (SSR), and Edge Streaming.',
      },
      {
        id: 's2-l2',
        title: '8. Next.js App Router, Server Components & Dynamic Routing',
        duration: '25:45',
        preview: false,
        description:
          'Build high-performance client applications with React 19, Server Components, suspense boundaries, layout nesting, and optimized asset loading.',
      },
      {
        id: 's2-l3',
        title: '9. RESTful API Design, Route Handlers & Zod Validation',
        duration: '21:30',
        preview: false,
        description:
          'Design clean REST contracts, implement typed route handlers, construct schema validation layers with Zod, and structure consistent HTTP error responses.',
      },
      {
        id: 's2-l4',
        title: '10. Relational Database Modeling with PostgreSQL & Prisma ORM',
        duration: '32:15',
        preview: false,
        description:
          'Design relational database schemas, execute migrations, configure one-to-many and many-to-many relationships, write raw SQL queries, and optimize index performance.',
      },
      {
        id: 's2-l5',
        title: '11. Error Handling Middleware & Global Boundary Strategies',
        duration: '15:20',
        preview: false,
        description:
          'Implement central error-handling middleware, structured application logging, HTTP status code best practices, and graceful exception recoveries.',
      },
      {
        id: 's2-l6',
        title: '12. Practical Deliverable: Live PostgreSQL CRUD Microservice',
        duration: '35:00',
        preview: false,
        description:
          'Build and deploy an end-to-end full stack CRUD application with relational data persistence, schema validations, and automated integration tests.',
      },
    ],
  },
  {
    module: 'Section 3: Production Engineering, Security & Cloud Deployment',
    weeks: 'Weeks 8-10',
    duration: '3h 15m',
    lecturesCount: 5,
    exercise: 'Containerize an end-to-end full stack application and deploy to AWS / Vercel.',
    lectures: [
      {
        id: 's3-l1',
        title: '13. Authentication, Authorization & HTTP-Only Session Security',
        duration: '19:40',
        preview: true,
        description:
          'Implement robust authentication flows using HTTP-only cookies, JWT verification, password hashing with bcrypt, role-based access control (RBAC), and CSRF protection.',
      },
      {
        id: 's3-l2',
        title: '14. Performance Optimization, Edge Caching & Core Web Vitals',
        duration: '23:15',
        preview: false,
        description:
          'Profile application performance, configure Redis caching, optimize bundle size, implement debouncing, and measure Google Core Web Vitals (LCP, FID, CLS).',
      },
      {
        id: 's3-l3',
        title: '15. Containerization with Docker & Multi-Stage Builds',
        duration: '27:50',
        preview: false,
        description:
          'Write production Dockerfiles, leverage multi-stage builds for minimal image size, orchestrate local multi-container environments with Docker Compose.',
      },
      {
        id: 's3-l4',
        title: '16. Automated CI/CD Pipelines with GitHub Actions',
        duration: '18:25',
        preview: false,
        description:
          'Create automated GitHub Actions workflows to run linter checks, test suites, build Docker images, and deploy previews automatically on pull requests.',
      },
      {
        id: 's3-l5',
        title: '17. Production Deployment, Monitoring & Health Checks',
        duration: '24:10',
        preview: false,
        description:
          'Deploy containerized applications to cloud platforms (AWS / Vercel), configure SSL certificates, set up custom domain DNS, and implement uptime health check endpoints.',
      },
    ],
  },
  {
    module: 'Section 4: Capstone Project & Career Placement Prep',
    weeks: 'Weeks 11-12',
    duration: '2h 50m',
    lecturesCount: 4,
    exercise: 'Ship capstone portfolio product with live public URL and verifiable GitHub repo.',
    lectures: [
      {
        id: 's4-l1',
        title: '18. Capstone Project Architecture Design Document (PRD)',
        duration: '20:15',
        preview: true,
        description:
          'Draft a comprehensive software architecture design document specifying entity relationships, API endpoint contracts, latency targets, and non-functional requirements.',
      },
      {
        id: 's4-l2',
        title: '19. Code Review Walkthrough with Senior Engineering Mentors',
        duration: '34:40',
        preview: false,
        description:
          'Participate in live 1:1 code review sessions where Staff Engineers critique pull requests on readability, edge-case coverage, and production reliability.',
      },
      {
        id: 's4-l3',
        title: '20. Technical Interview Simulations & System Design Live Coding',
        duration: '40:10',
        preview: false,
        description:
          'Practice live coding challenges under realistic interview time limits, solve architectural scaling problems on virtual whiteboards, and receive rubric-based scoring.',
      },
      {
        id: 's4-l4',
        title: '21. Direct Recruiter Referrals, Resume Polish & Offer Negotiation',
        duration: '18:30',
        preview: false,
        description:
          'Optimize your technical resume for applicant tracking systems (ATS), polish your GitHub profile, receive direct recruiter introductions, and evaluate job offers.',
      },
    ],
  },
]

const COURSE_FAQS = [
  {
    q: 'Who is eligible to join this course?',
    a: 'College students (B.Tech, BCA, MCA, B.Sc), fresh graduates, and working professionals looking to transition into high-growth software engineering or data roles are eligible. No prior advanced programming experience is required as we build progressively from fundamentals.',
  },
  {
    q: 'How does course enrollment work?',
    a: 'Once you enroll, you get immediate access to your student dashboard, onboarding orientation, curriculum materials, and community channels.',
  },
  {
    q: 'What is the schedule and weekly time commitment?',
    a: 'Sessions and coursework are structured flexibly with complete access on your student dashboard. We recommend dedicating 6 to 8 hours per week for learning modules, coding assignments, and capstone project development.',
  },
  {
    q: 'Will I receive a verifiable certificate upon completion?',
    a: 'Yes. Upon completing the modules and presenting your capstone project, you receive a cryptographically verifiable CareerCatch Completion Certificate with a unique credential ID, shareable directly on LinkedIn and resumes.',
  },
  {
    q: 'What kind of placement support is provided?',
    a: 'Our career services include personalized resume optimization, GitHub portfolio reviews, mock technical interview sessions with senior engineers, and direct referrals to over 200+ partner tech companies.',
  },
]

const TESTIMONIALS_DATA = [
  {
    name: 'Ananya Sharma',
    role: 'Software Development Engineer',
    company: 'CRED',
    avatar: '/images/faculty/priya-sharma.jpg',
    text: 'CareerCatch provided exactly what college was missing: building real microservices, conducting PR reviews, and thinking like a staff engineer. The direct mentorship helped me crack my dream placement.',
    rating: 5,
  },
  {
    name: 'Rohit Verma',
    role: 'Data Analyst & ML Specialist',
    company: 'PhonePe',
    avatar: '/images/faculty/ravi-kumar.jpg',
    text: 'The hands-on capstone projects gave me verifiable proof of work. During the interviews, the panel specifically praised the architecture document and clean GitHub repository I built here.',
    rating: 5,
  },
  {
    name: 'Siddharth Rao',
    role: 'Full Stack Engineer',
    company: 'Razorpay',
    avatar: '/images/faculty/arjun-mehta.jpg',
    text: 'The practical approach made all the difference. Building real systems and having line-by-line code reviews beats passive tutorials every single time.',
    rating: 5,
  },
  {
    name: 'Pooja Gupta',
    role: 'Frontend Architect',
    company: 'Swiggy',
    avatar: '/images/faculty/sneha-patel.jpg',
    text: 'Got placed with a CTC package I did not think was possible coming from a tier-3 college. CareerCatch completely leveled the playing field for me.',
    rating: 5,
  },
]

const REVIEWS_BREAKDOWN = [
  { stars: 5, percent: 84 },
  { stars: 4, percent: 12 },
  { stars: 3, percent: 3 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 0 },
]

const VERIFIED_REVIEWS = [
  {
    initials: 'KV',
    name: 'Karthik V.',
    date: 'Reviewed Oct 24, 2026',
    rating: 5,
    text: 'The syllabus is extraordinarily up to date. We built real production-grade code with TypeScript, Next.js, and PostgreSQL. Mentors reviewed my pull requests with actionable feedback.',
  },
  {
    initials: 'NS',
    name: 'Neha S.',
    date: 'Reviewed Oct 12, 2026',
    rating: 5,
    text: 'Clear explanations, practical hands-on exercises after every single module, and the capstone project is now the centerpiece of my GitHub portfolio.',
  },
  {
    initials: 'AM',
    name: 'Aditya M.',
    date: 'Reviewed Sep 28, 2026',
    rating: 5,
    text: 'Excellent pacing for working professionals and students alike. The flexible curriculum and practical assignments allowed me to upskill without disturbing my college schedule.',
  },
]

const NAV_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'instructor', label: 'Instructor' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faqs', label: 'FAQs' },
]

export default function CourseDetailClient({
  slug,
  initialCourse,
}: {
  slug: string
  initialCourse: Course | null
}) {
  const router = useRouter()
  const { user } = useStudentAuth()

  const [course, setCourse] = useState<Course | null>(initialCourse)
  const [loading, setLoading] = useState(!initialCourse)

  // Curriculum accordion state: set of open section indices
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]))

  // Expanded lectures state: set of open lecture IDs for the dropdown description
  const [openLectures, setOpenLectures] = useState<Set<string>>(new Set(['s1-l1']))

  // Description expand/collapse
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Sticky sub-navbar state
  const [isSticky, setIsSticky] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Modals state
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewLectureTitle, setPreviewLectureTitle] = useState('')
  const [enrolling, setEnrolling] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({})

  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  useEffect(() => {
    async function loadCourse() {
      if (!initialCourse) setLoading(true)
      const data = await apiService.getCourseBySlug(slug)
      if (data) setCourse(data)
      setLoading(false)
    }
    loadCourse()
  }, [slug, initialCourse])

  // Scroll listener for sticky sub-navbar and tab highlighting
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsSticky(window.scrollY > 340)

          const tabs = ['overview', 'curriculum', 'instructor', 'reviews', 'faqs']
          for (const tab of [...tabs].reverse()) {
            const el = document.getElementById(tab)
            if (el) {
              const rect = el.getBoundingClientRect()
              if (rect.top <= 220) {
                setActiveTab(tab)
                break
              }
            }
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTab = (id: string) => {
    setActiveTab(id)
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -140
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  // Enrollment handler
  const handleEnrollClick = async () => {
    if (!course) return

    if (!user) {
      setAuthModalOpen(true)
      return
    }

    setEnrolling(true)
    try {
      await apiService.enrollInCourse(course.id)
      setToastMsg('Enrolled successfully! Redirecting to your Student Hub...')
      setTimeout(() => {
        router.push(`/student/dashboard?enrolled=${course.id}`)
      }, 900)
    } catch {
      router.push(`/student/dashboard?enrolled=${course.id}`)
    } finally {
      setEnrolling(false)
    }
  }

  const handleAuthSuccess = async () => {
    if (!course) return
    try {
      await apiService.enrollInCourse(course.id)
    } catch {
      // Ignored if already enrolled
    }
    router.push(`/student/dashboard?enrolled=${course.id}`)
  }

  // Toggle single section
  const toggleSection = (idx: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      return next
    })
  }

  // Toggle single lecture description dropdown
  const toggleLecture = (lectureId: string) => {
    setOpenLectures((prev) => {
      const next = new Set(prev)
      if (next.has(lectureId)) {
        next.delete(lectureId)
      } else {
        next.add(lectureId)
      }
      return next
    })
  }

  // Toggle all sections
  const toggleAllSections = () => {
    const allCount = syllabus.length
    if (openSections.size === allCount) {
      setOpenSections(new Set())
    } else {
      setOpenSections(new Set(Array.from({ length: allCount }, (_, i) => i)))
    }
  }

  // Trigger video preview modal
  const handleOpenPreview = (lectureTitle?: string) => {
    setPreviewLectureTitle(lectureTitle || 'Course Overview & Curriculum Preview')
    setPreviewModalOpen(true)
  }

  // Share course URL
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setToastMsg('Course link copied to clipboard!')
      setTimeout(() => setToastMsg(''), 3000)
    }
  }

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return
    setCouponApplied(true)
    setToastMsg(`Coupon "${couponCode.toUpperCase()}" applied!`)
    setTimeout(() => setToastMsg(''), 3000)
  }

  // Normalized syllabus with fallback
  const syllabus: SyllabusSection[] = useMemo(() => {
    if (course?.syllabus && Array.isArray(course.syllabus) && course.syllabus.length > 0) {
      return course.syllabus.map((item: any, i: number) => ({
        module: item.module || `Section ${i + 1}: Core Fundamentals`,
        weeks: item.weeks || `Module ${i + 1}`,
        duration: item.duration || '3h 30m',
        lecturesCount: item.lectures?.length || item.topics?.length || 5,
        exercise: item.exercise,
        lectures: item.lectures
          ? item.lectures.map((l: any, lidx: number) => ({
              id: l.id || `s${i + 1}-l${lidx + 1}`,
              title: l.title || `${lidx + 1}. Lecture Overview`,
              duration: l.duration || '12:00',
              preview: l.preview ?? (lidx === 0 || lidx === 1),
              description:
                l.description ||
                'Examine core architectural patterns, design principles, modular abstractions, and hands-on implementations for this module deliverable.',
            }))
          : (item.topics || []).map((t: string, tidx: number) => ({
              id: `s${i + 1}-l${tidx + 1}`,
              title: `${tidx + 1}. ${t}`,
              duration: `${10 + tidx * 3}:00`,
              preview: tidx === 0 || tidx === 1,
              description: `Deep dive into ${t}. Learn practical techniques, modular patterns, and industry-standard best practices.`,
            })),
      }))
    }
    return DEFAULT_SYLLABUS
  }, [course])

  // Total lecture count & total course duration
  const totalLectures = useMemo(() => {
    return syllabus.reduce((acc, s) => acc + (s.lectures?.length || s.lecturesCount || 5), 0)
  }, [syllabus])

  const relatedCourses = useMemo(() => {
    if (!course) return []
    return COURSES.filter((c) => c.id !== course.id).slice(0, 5)
  }, [course])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading course curriculum...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Course Not Found</h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md">
            The course details you requested could not be located. Browse our catalog of industry-aligned tracks.
          </p>
          <Link
            href="/courses"
            className="px-5 py-2.5 rounded-xl bg-[#0056D2] text-white font-semibold text-sm hover:bg-[#00419e] transition-colors shadow-sm"
          >
            Explore All Programs
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const originalPrice = course.originalPrice || Math.round(course.price * 2.2)
  const discountPercent = Math.max(10, Math.round(((originalPrice - course.price) / originalPrice) * 100))

  return (
    <div className="bg-[#FFFFFF] min-h-screen flex flex-col justify-between font-['Inter'] text-slate-900">
      <Navbar />

      {/* ─── Sticky Sub-Navbar on Scroll ────────────────────────────── */}
      {isSticky && (
        <div className="fixed top-[68px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-md transition-all duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2.5 gap-4">
              <div className="flex flex-col min-w-0 pr-4">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate font-['Plus_Jakarta_Sans']">
                  {course.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-bold text-amber-500">{course.rating || 4.8} ★</span>
                  <span className="text-slate-400">({(course.reviews || 312).toLocaleString()} ratings)</span>
                  <span className="hidden sm:inline text-slate-400">• {(course.reviews * 12 + 1420).toLocaleString()} students</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-base font-bold text-slate-900">
                    ₹{course.price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleEnrollClick}
                  disabled={enrolling}
                  className="px-5 py-2.5 rounded-md bg-[#0056D2] hover:bg-[#00419e] text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 sm:gap-4 border-t border-slate-100 py-1.5 overflow-x-auto scrollbar-none text-xs">
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => scrollToTab(tab.id)}
                    className={`px-2.5 py-1 font-semibold whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                      isActive
                        ? 'border-[#0056D2] text-[#0056D2] font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle size={20} weight="fill" />
          <span>{toastMsg}</span>
        </div>
      )}

      <main className="relative">
        {/* ════════════════════════════════════════════════════════════════
            1. HERO BANNER: ORIGINAL LIGHT GRADIENT & COMPANY LOGO WATERMARK
           ════════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#EFF6FF] border-b border-slate-200/80 pt-8 pb-12 lg:pb-16">
          {/* Large Translucent CareerCatch Logo Watermark in Background */}
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-12 md:-right-8 md:-top-8 pointer-events-none select-none opacity-[0.08] md:opacity-[0.10] z-0 overflow-hidden"
          >
            <svg
              width="540"
              height="540"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transform rotate-[-12deg]"
            >
              {/* Main electric blue arc */}
              <path
                d="M16 4C9.37 4 4 9.37 4 16C4 22.63 9.37 28 16 28C21.4 28 25.95 24.45 27.5 19.5"
                stroke="#155EEF"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* Vibrant warm orange accent arc */}
              <path
                d="M27.8 13.5C27.2 9.8 24.6 6.8 21.2 5.2"
                stroke="#FF9F1C"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* Inner blue dot */}
              <circle cx="15.5" cy="16" r="3.2" fill="#155EEF" />
              {/* Inner orange spark */}
              <circle cx="19.5" cy="12" r="1.8" fill="#FF9F1C" />
            </svg>
          </div>

          <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              {/* Partner / Organization Logo */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                      <path
                        d="M16 4C9.37 4 4 9.37 4 16C4 22.63 9.37 28 16 28C21.4 28 25.95 24.45 27.5 19.5"
                        stroke="#155EEF"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M27.8 13.5C27.2 9.8 24.6 6.8 21.2 5.2"
                        stroke="#FF9F1C"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <circle cx="15.5" cy="16" r="3" fill="#155EEF" />
                      <circle cx="19.5" cy="12" r="1.6" fill="#FF9F1C" />
                    </svg>
                  </div>
                  <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-xs text-[#101B3C]">
                    CareerCatch
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium pl-1 border-l border-slate-200">
                    Industry Partner
                  </span>
                </div>
              </div>

              {/* Course Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight text-[#101B3C] leading-tight mb-3">
                {course.title}
              </h1>

              {/* Specialization / Program Subtitle */}
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-4">
                This course is part of the{' '}
                <Link
                  href={`/courses?category=${encodeURIComponent(course.category)}`}
                  className="text-[#0056D2] hover:underline font-bold"
                >
                  {course.category} Professional Specialization
                </Link>
              </p>

              {/* Instructor Attribution Line */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                  {course.instructorAvatar ? (
                    <img
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users size={20} className="m-auto text-slate-600 mt-2" />
                  )}
                </div>
                <div className="text-xs">
                  <span className="text-slate-500">Taught by </span>
                  <span className="font-bold text-slate-900">{course.instructor}</span>
                  <span className="text-slate-400"> • </span>
                  <span className="text-slate-600 font-medium">Senior Engineering Mentor</span>
                </div>
              </div>

              {/* CTA Action Area */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                <button
                  type="button"
                  onClick={handleEnrollClick}
                  disabled={enrolling}
                  className="px-6 py-3.5 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <span>{enrolling ? 'Enrolling...' : 'Enroll for Free'}</span>
                  <ArrowRight size={16} weight="bold" />
                </button>

                <button
                  type="button"
                  onClick={() => setDemoModalOpen(true)}
                  className="px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
                >
                  <Sparkle size={15} weight="fill" className="text-amber-500" />
                  <span>Book Free Consultation</span>
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Users size={14} className="text-blue-600" />
                  <span>{(course.reviews * 12 + 1420).toLocaleString()} learners already enrolled</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            2. HORIZONTAL 4-STAT METRIC BAR (Coursera Style Card Under Hero)
           ════════════════════════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Stat 1: Course Type */}
            <div className="flex flex-col justify-center px-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Format
              </span>
              <span className="text-sm font-bold text-slate-900 mt-0.5">
                {course.certificateType || 'Professional Certificate'}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                Hands-On &amp; Capstone Project
              </span>
            </div>

            {/* Stat 2: Rating */}
            <div className="flex flex-col justify-center px-2 pt-3 md:pt-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Learner Rating
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-extrabold text-slate-900">{course.rating || 4.8}</span>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} weight="fill" />
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5">
                ({(course.reviews || 312).toLocaleString()} verified ratings)
              </span>
            </div>

            {/* Stat 3: Level */}
            <div className="flex flex-col justify-center px-2 pt-3 md:pt-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Experience Level
              </span>
              <span className="text-sm font-bold text-slate-900 mt-0.5">
                {course.level || 'Beginner level'}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                No prior coding degree required
              </span>
            </div>

            {/* Stat 4: Schedule */}
            <div className="flex flex-col justify-center px-2 pt-3 md:pt-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Schedule &amp; Duration
              </span>
              <span className="text-sm font-bold text-slate-900 mt-0.5">
                {course.duration || '48 Hours'}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                Flexible weekend classes (6-8 hrs/wk)
              </span>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            MAIN COURSE CONTENT SECTIONS
           ════════════════════════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-12">

          {/* ─── SECTION 1: WHAT YOU WILL LEARN & SKILLS GAINED (id="about") ─── */}
          <section id="about" className="scroll-mt-36 bg-white rounded-2xl p-6 md:p-8 border border-slate-200/90 shadow-2xs space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 mb-2">
                What you will learn
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Designed to bridge academic knowledge with high-scale tech engineering, this curriculum takes you from core design patterns to building, testing, containerizing, and shipping production applications.
              </p>

              {/* 4-Box Key Takeaways */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Understand real-world production system design, scalable architecture, and modular clean code practices.',
                  'Develop high-performance client applications with state management, server-side rendering, and responsive UI.',
                  'Design robust RESTful APIs with database schemas, relational migrations, connection pooling, and indexing.',
                  'Implement CI/CD workflows, automated testing, Docker containers, and live deployment on cloud infrastructure.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={13} weight="bold" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-700 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills You Will Gain */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                Skills you will gain
              </h3>
              <div className="flex flex-wrap gap-2">
                {(course.skills && course.skills.length > 0
                  ? course.skills
                  : ['React', 'Node.js', 'PostgreSQL', 'Next.js', 'REST APIs', 'System Design', 'Git', 'Docker']
                ).map((skill: string, sidx: number) => (
                  <span
                    key={sidx}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Details to Know Grid (Coursera Style 4 Details) */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                Details to know
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-start gap-3">
                  <Certificate size={22} className="text-blue-600 shrink-0 mt-0.5" weight="duotone" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Shareable Certificate</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Add directly to your LinkedIn profile and resume</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Laptop size={22} className="text-blue-600 shrink-0 mt-0.5" weight="duotone" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">100% Online &amp; Flexible</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Structured self-paced modules and project reviews</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={22} className="text-blue-600 shrink-0 mt-0.5" weight="duotone" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Flexible Schedule</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Learn alongside full-time college study or work</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe size={22} className="text-blue-600 shrink-0 mt-0.5" weight="duotone" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">English &amp; Bilingual</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">English curriculum with bilingual Q&amp;A support</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── SECTION 2: HIRING COMPANIES BANNER ─────────────────────── */}
          <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-md text-center md:text-left">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                See how employees at top companies are mastering in-demand skills
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Alumni from this program work at tier-1 product companies and hyper-growth tech startups.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-80">
              {['razorpay', 'swiggy', 'amazon', 'infosys', 'cred'].map((slug) => (
                <img
                  key={slug}
                  src={`https://cdn.simpleicons.org/${slug}/0F172A`}
                  alt={slug}
                  className="h-5 sm:h-6 w-auto object-contain grayscale hover:grayscale-0 transition-all opacity-75 hover:opacity-100"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </section>

          {/* ─── SECTION 3: BUILD EXPERTISE WITH HANDS-ON LEARNING ──────── */}
          <section id="outcomes" className="scroll-mt-36 bg-white rounded-2xl p-6 md:p-10 border border-slate-200/90 shadow-2xs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-2">
                  Applied Learning
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 leading-tight mb-4">
                  Build your expertise with hands-on capstone projects
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  You will not just watch recorded lectures. Every module includes interactive code labs, architecture design challenges, and real-world pull request reviews led by senior software engineers.
                </p>

                <div className="space-y-3.5 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={18} weight="fill" className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Production Code Reviews</h4>
                      <p className="text-[11px] text-slate-500">Every assignment receives line-by-line feedback on clean code, edge cases, and performance.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle size={18} weight="fill" className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Public GitHub Portfolio</h4>
                      <p className="text-[11px] text-slate-500">Graduate with live hosted applications and verifiable GitHub repositories recruiters praise.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle size={18} weight="fill" className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Direct Senior Engineering Mentorship</h4>
                      <p className="text-[11px] text-slate-500">Get unblocked anytime with dedicated mock interviews and technical guidance.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setDemoModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-blue-50 text-[#0056D2] hover:bg-blue-100 font-bold text-xs sm:text-sm border border-blue-200 transition-colors cursor-pointer"
                  >
                    Schedule Academic Consultation →
                  </button>
                </div>
              </div>

              {/* Right Side Image */}
              <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-md aspect-16/10 sm:aspect-16/11 bg-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80"
                  alt="Student coding on laptop with modern workspace"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </section>

          {/* ─── SECTION 4: COURSE SYLLABUS & MODULES (id="modules") ─────── */}
          <section id="modules" className="scroll-mt-36">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
                Course syllabus &amp; modules
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                There are {syllabus.length} comprehensive modules in this program.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left 2 Cols: Accordion Modules */}
              <div className="lg:col-span-2 space-y-3">
                {syllabus.map((mod: (typeof DEFAULT_SYLLABUS)[number], index: number) => {
                  const isOpen = openModuleIndex === index
                  return (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenModuleIndex(isOpen ? null : index)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-slate-50/80 text-left transition-colors cursor-pointer"
                      >
                        <div>
                          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                            {mod.weeks || `Module ${index + 1}`}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-slate-900">
                            {mod.module}
                          </span>
                        </div>
                        {isOpen ? (
                          <CaretUp size={18} className="text-slate-500 shrink-0 ml-3" />
                        ) : (
                          <CaretDown size={18} className="text-slate-500 shrink-0 ml-3" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-4 sm:p-5 bg-slate-50/50 border-t border-slate-200 space-y-3.5">
                          <ul className="space-y-2">
                            {(mod.topics || []).map((topic: string, tidx: number) => (
                              <li key={tidx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                          {mod.exercise && (
                            <div className="mt-3 p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                              <Code size={16} className="text-blue-600 shrink-0 mt-0.5" />
                              <span>
                                <strong>Practical Deliverable:</strong> {mod.exercise}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Right Col: Instructor & Offered By Sidebar */}
              <div className="lg:col-span-1 space-y-5">
                {/* Instructor Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                    Instructor
                  </span>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {course.instructorAvatar ? (
                        <img
                          src={course.instructorAvatar}
                          alt={course.instructor}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users size={24} className="m-auto text-slate-600 mt-3" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{course.instructor}</h3>
                      <p className="text-[11px] text-slate-500">Staff Engineering Mentor</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Senior practitioner with 8+ years experience guiding engineers in architecture, clean code, and production scaling.
                  </p>
                </div>

                {/* Offered By Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                    Offered by
                  </span>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-[#155EEF]/10 text-[#155EEF] font-bold text-xs flex items-center justify-center">
                      CC
                    </div>
                    <span className="text-xs font-bold text-slate-900">CareerCatch</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Empowering students and developers through verified tech curriculum, hands-on projects, and direct engineering placement support.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── SECTION 5: EXPLORE MORE RELATED COURSES (id="recommendations") ─── */}
          <section id="recommendations" className="scroll-mt-36">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
                  Explore more related programs
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Learners interested in {course.title} also explored these tracks.
                </p>
              </div>
              <Link
                href="/courses"
                className="text-xs sm:text-sm font-bold text-[#0056D2] hover:underline"
              >
                View all courses →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedCourses.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/courses/${rel.slug}`}
                  className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 overflow-hidden transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col group"
                >
                  <div className="aspect-16/9 w-full bg-slate-100 overflow-hidden relative">
                    <img
                      src={rel.thumbnail || '/images/courses/fullstack-web.jpg'}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-slate-800 shadow-xs">
                      {rel.partner || 'CareerCatch'}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0056D2] transition-colors line-clamp-2 mb-1.5">
                        {rel.title}
                      </h3>
                      <div className="text-[11px] text-slate-500">{rel.duration} • {rel.level}</div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star size={13} weight="fill" />
                        <span>{rel.rating}</span>
                      </div>
                      <span className="font-bold text-slate-900">
                        ₹{rel.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ─── SECTION 6: WHY PEOPLE CHOOSE CAREERCATCH (id="testimonials") ─── */}
          <section id="testimonials" className="scroll-mt-36">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
                Why people choose CareerCatch for their courses
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real stories from students and engineers who launched their careers with us.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TESTIMONIALS_DATA.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                        <p className="text-[10px] text-slate-500">{t.role} @ <strong className="text-blue-600">{t.company}</strong></p>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={13} weight="fill" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>

                  <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle size={13} weight="fill" />
                    <span>Verified CareerCatch Graduate</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── SECTION 7: RATINGS & VERIFIED REVIEWS (id="reviews") ─────── */}
          <section id="reviews" className="scroll-mt-36 bg-white rounded-2xl p-6 md:p-8 border border-slate-200/90 shadow-2xs">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
                Learner reviews and ratings
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verified feedback from enrolled students across recent programs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Rating breakdown */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black font-['Plus_Jakarta_Sans'] text-[#0056D2]">
                    {course.rating || 4.8}
                  </span>
                  <div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} weight="fill" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {(course.reviews || 312).toLocaleString()} ratings
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {REVIEWS_BREAKDOWN.map((row) => (
                    <div key={row.stars} className="flex items-center gap-2 text-xs">
                      <span className="w-12 text-slate-600 font-medium">{row.stars} stars</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${row.percent}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-slate-400 text-[11px]">{row.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 2 Columns: Review Cards */}
              <div className="lg:col-span-2 space-y-4">
                {VERIFIED_REVIEWS.map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0056D2]/10 text-[#0056D2] font-bold text-xs flex items-center justify-center">
                          {rev.initials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{rev.name}</div>
                          <div className="text-[10px] text-slate-500">{rev.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={13} weight="fill" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── SECTION 8: SHAREABLE CERTIFICATE ───────────────────────── */}
          <section className="bg-gradient-to-r from-[#101B3C] to-[#1E293B] text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                <Certificate size={15} weight="fill" />
                <span>Verified Career Credential</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans']">
                Earn a career certificate upon completion
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Add your verified certificate directly to LinkedIn and your resume. Showcase verifiable capstone project work to tech recruiters.
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={handleEnrollClick}
                disabled={enrolling}
                className="px-6 py-3 rounded-xl bg-white text-[#101B3C] font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
              >
                Enroll Now to Start Learning →
              </button>
            </div>
          </section>

          {/* ─── SECTION 9: FREQUENTLY ASKED QUESTIONS ──────────────────── */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/90 shadow-2xs">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
                Frequently asked questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Everything you need to know about enrollment, course schedules, and certificates.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* FAQ Accordion */}
              <div className="lg:col-span-2 space-y-3">
                {COURSE_FAQS.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx
                  return (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 text-left transition-colors cursor-pointer"
                      >
                        <span className="text-xs sm:text-sm font-bold text-slate-900 pr-3">{faq.q}</span>
                        {isOpen ? <CaretUp size={16} className="text-slate-500 shrink-0" /> : <CaretDown size={16} className="text-slate-500 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-slate-50/50 border-t border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Need Help / Talk to Advisor Card */}
              <div className="lg:col-span-1 bg-blue-50/70 rounded-2xl p-5 border border-blue-100 space-y-3 text-center sm:text-left">
                <span className="text-xs font-bold text-blue-900 block">
                  Have more questions?
                </span>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Speak directly with an academic counselor to choose the right track for your career background.
                </p>
                <button
                  type="button"
                  onClick={() => setDemoModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Book Free Demo &amp; Counseling
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />

      {/* Demo Booking Modal */}
      <DemoBookingModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        initialCourse={course.title}
      />

      {/* Coursera-style 2-Step Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        courseTitle={course.title}
      />
    </div>
  )
}
