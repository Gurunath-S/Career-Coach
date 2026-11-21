'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  List,
  X,
  CaretDown,
  MagnifyingGlass,
  User,
  SignOut,
  Code,
  ChartLine,
  PenNib,
  Cloud,
  DeviceMobile,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  ChatCircleDots,
} from '@phosphor-icons/react'
import Logo from '../common/Logo'
import { useStudentAuth } from '@/context/StudentAuthContext'
import { AuthModal } from '../modals/AuthModal'
import { COURSES } from '@/lib/constants'

const EXPLORE_CATEGORIES = [
  {
    title: 'Full Stack Web Development',
    desc: 'React, Next.js, Node, System Design',
    categoryKey: 'Full Stack',
    icon: Code,
    color: '#155EEF',
  },
  {
    title: 'Data Science & AI',
    desc: 'Python, ML, Deep Learning, SQL',
    categoryKey: 'Data Science',
    icon: ChartLine,
    color: '#7C3AED',
  },
  {
    title: 'UI/UX Design',
    desc: 'Figma, Design Systems, Research',
    categoryKey: 'UI/UX Design',
    icon: PenNib,
    color: '#FF9F1C',
  },
  {
    title: 'Cloud & DevOps',
    desc: 'AWS, Docker, CI/CD, Kubernetes',
    categoryKey: 'Cloud',
    icon: Cloud,
    color: '#059669',
  },
  {
    title: 'Mobile Development',
    desc: 'Flutter, React Native, Mobile Architecture',
    categoryKey: 'Mobile',
    icon: DeviceMobile,
    color: '#EA580C',
  },
  {
    title: 'Career Mentorship Tracks',
    desc: 'Mock Interviews, Code Reviews & Placement',
    categoryKey: 'Full Stack',
    icon: ShieldCheck,
    color: '#0284C7',
  },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useStudentAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navExploreOpen, setNavExploreOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const navExploreRef = useRef<HTMLDivElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Auth Modal state
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'step1' | 'otp' | 'signup' | 'login'>('step1')

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 10
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev))
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navExploreRef.current && !navExploreRef.current.contains(e.target as Node)) {
        setNavExploreOpen(false)
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const auth = params.get('auth')
      if (auth === 'login' || auth === 'signup') {
        setAuthMode(auth === 'login' ? 'step1' : 'signup')
        setAuthModalOpen(true)
        const url = new URL(window.location.href)
        url.searchParams.delete('auth')
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''))
      }
    }
  }, [])

  // Filter available courses for live search suggestions
  const queryClean = searchQuery.trim().toLowerCase()
  const matchedCourses = queryClean
    ? COURSES.filter((c) => {
        const titleMatch = c.title.toLowerCase().includes(queryClean)
        const catMatch = c.category.toLowerCase().includes(queryClean)
        const skillMatch = c.skills?.some((s) => s.toLowerCase().includes(queryClean))
        return titleMatch || catMatch || skillMatch
      }).slice(0, 5)
    : []

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchFocused(false)
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/courses')
    }
  }

  const openAuth = (mode: 'step1' | 'login' | 'signup') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
    setMobileOpen(false)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 bg-white font-['Inter'] ${
          scrolled ? 'shadow-xs border-b border-slate-200/90' : 'border-b border-slate-200'
        }`}
        style={{ height: '68px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3 sm:gap-6">
          {/* ─── Left: Brand Logo ────────────────────────────────────── */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Logo className="shrink-0 flex items-center" />
          </div>

          {/* ─── Center: Live Filter Search with Instant Dropdown ──────── */}
          <div ref={searchContainerRef} className="flex-1 max-w-md hidden md:block relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSearchFocused(true)
                }}
                placeholder="Search available courses, skills, technologies..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20 transition-all bg-slate-50/50 hover:bg-white"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0056D2] hover:bg-[#00419e] text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Search"
                aria-label="Search available courses"
              >
                <MagnifyingGlass size={15} weight="bold" />
              </button>
            </form>

            {/* Live Autocomplete Results Dropdown */}
            <AnimatePresence>
              {searchFocused && searchQuery.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 p-2"
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Available Courses</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {matchedCourses.length} results
                    </span>
                  </div>

                  {matchedCourses.length > 0 ? (
                    <div className="space-y-1">
                      {matchedCourses.map((c) => (
                        <Link
                          key={c.id}
                          href={`/courses/${c.slug || c.id}`}
                          onClick={() => {
                            setSearchFocused(false)
                            setSearchQuery('')
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/70 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-blue-600">
                            {c.thumbnail ? (
                              <img
                                src={c.thumbnail}
                                alt={c.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              c.category.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0056D2] truncate">
                              {c.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-medium">
                                {c.category}
                              </span>
                              <span>•</span>
                              <span>{c.duration}</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-800 shrink-0">
                            ₹{c.price.toLocaleString('en-IN')}
                          </span>
                        </Link>
                      ))}

                      <div className="pt-2 mt-1 border-t border-slate-100 text-center">
                        <Link
                          href={`/courses?search=${encodeURIComponent(searchQuery)}`}
                          onClick={() => setSearchFocused(false)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0056D2] hover:underline py-1"
                        >
                          <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                          <ArrowRight size={13} weight="bold" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center space-y-1">
                      <p className="text-xs font-semibold text-slate-700">
                        No courses found for &ldquo;{searchQuery}&rdquo;
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Try searching for Full Stack, Python, AWS, or UI/UX
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Right: Navigation Links with Enquiry at the End & Auth ── */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-semibold text-slate-700">
              {user ? (
                <>
                  <Link
                    href="/"
                    className={`hover:text-[#0056D2] transition-colors py-1 ${
                      pathname === '/' ? 'text-[#0056D2] font-bold' : 'text-slate-700'
                    }`}
                  >
                    Home
                  </Link>

                  <Link
                    href="/my-learning"
                    className={`hover:text-[#0056D2] transition-colors flex items-center gap-1.5 py-1 ${
                      pathname === '/my-learning' ? 'text-[#0056D2] font-bold' : 'text-slate-700'
                    }`}
                  >
                    <BookOpen size={16} weight="bold" />
                    <span>My learning</span>
                  </Link>

                  {/* Explore Dropdown: plain text with CaretDown, NOT styled like a button */}
                  <div
                    ref={navExploreRef}
                    className="relative"
                    onMouseEnter={() => setNavExploreOpen(true)}
                    onMouseLeave={() => setNavExploreOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setNavExploreOpen(!navExploreOpen)}
                      className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer py-1 ${
                        navExploreOpen ? 'text-[#0056D2]' : 'text-slate-700 hover:text-[#0056D2]'
                      }`}
                      aria-expanded={navExploreOpen}
                    >
                      <span>Explore</span>
                      <CaretDown
                        size={13}
                        weight="bold"
                        className={`transition-transform duration-200 ${
                          navExploreOpen ? 'rotate-180 text-[#0056D2]' : 'text-slate-500'
                        }`}
                      />
                    </button>

                    {/* Explore Dropdown Panel */}
                    <AnimatePresence>
                      {navExploreOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] w-88 md:w-[460px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 text-left"
                        >
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-2">
                            Browse Tech Specializations
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {EXPLORE_CATEGORIES.map((track) => {
                              const Icon = track.icon
                              return (
                                <Link
                                  key={track.title}
                                  href={`/courses?category=${encodeURIComponent(track.categoryKey)}`}
                                  onClick={() => setNavExploreOpen(false)}
                                  className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                                >
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${track.color}15`, color: track.color }}
                                  >
                                    <Icon size={18} weight="duotone" />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-[#101B3C] group-hover:text-[#0056D2] transition-colors leading-tight truncate">
                                      {track.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">
                                      {track.desc}
                                    </p>
                                  </div>
                                </Link>
                              )
                            })}
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs px-2">
                            <span className="text-slate-500">Industry-Aligned Specializations</span>
                            <Link
                              href="/courses"
                              onClick={() => setNavExploreOpen(false)}
                              className="font-bold text-[#0056D2] hover:underline"
                            >
                              View All Programs →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link href="/blog" className="hover:text-[#0056D2] transition-colors">
                    Blog
                  </Link>
                </>
              ) : (
                <>
                  {/* Explore Dropdown: plain text with CaretDown, NOT styled like a button */}
                  <div
                    ref={navExploreRef}
                    className="relative"
                    onMouseEnter={() => setNavExploreOpen(true)}
                    onMouseLeave={() => setNavExploreOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setNavExploreOpen(!navExploreOpen)}
                      className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer py-1 ${
                        navExploreOpen ? 'text-[#0056D2]' : 'text-slate-700 hover:text-[#0056D2]'
                      }`}
                      aria-expanded={navExploreOpen}
                    >
                      <span>Explore</span>
                      <CaretDown
                        size={13}
                        weight="bold"
                        className={`transition-transform duration-200 ${
                          navExploreOpen ? 'rotate-180 text-[#0056D2]' : 'text-slate-500'
                        }`}
                      />
                    </button>

                    {/* Explore Dropdown Panel */}
                    <AnimatePresence>
                      {navExploreOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] w-88 md:w-[460px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 text-left"
                        >
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-2">
                            Browse Tech Specializations
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {EXPLORE_CATEGORIES.map((track) => {
                              const Icon = track.icon
                              return (
                                <Link
                                  key={track.title}
                                  href={`/courses?category=${encodeURIComponent(track.categoryKey)}`}
                                  onClick={() => setNavExploreOpen(false)}
                                  className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                                >
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${track.color}15`, color: track.color }}
                                  >
                                    <Icon size={18} weight="duotone" />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-[#101B3C] group-hover:text-[#0056D2] transition-colors leading-tight truncate">
                                      {track.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">
                                      {track.desc}
                                    </p>
                                  </div>
                                </Link>
                              )
                            })}
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs px-2">
                            <span className="text-slate-500">Industry-Aligned Specializations</span>
                            <Link
                              href="/courses"
                              onClick={() => setNavExploreOpen(false)}
                              className="font-bold text-[#0056D2] hover:underline"
                            >
                              View All Programs →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <Link href="/#why-us" className="hover:text-[#0056D2] transition-colors">
                    Why Us
                  </Link>
                  <Link href="/#methodology" className="hover:text-[#0056D2] transition-colors">
                    Learning Flow
                  </Link>
                  <Link href="/#mentors" className="hover:text-[#0056D2] transition-colors">
                    Mentors
                  </Link>
                  <Link href="/blog" className="hover:text-[#0056D2] transition-colors">
                    Blog
                  </Link>

                  {/* Enquiry Link - Placed Last in the Navigation Menu */}
                  <Link
                    href="/#enquiry"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0056D2] bg-blue-50 hover:bg-blue-100/80 border border-blue-200 transition-all flex items-center gap-1.5"
                  >
                    <ChatCircleDots size={14} weight="bold" />
                    <span>Enquiry</span>
                  </Link>
                </>
              )}
            </nav>

            {/* Auth / Student Profile */}
            {user ? (
              /* User logged in: Profile Dropdown as normal text */
              <div
                ref={userMenuRef}
                className="relative"
                onMouseEnter={() => setUserDropdownOpen(true)}
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-1.5 font-semibold text-xs sm:text-sm transition-colors cursor-pointer py-1 ${
                    userDropdownOpen ? 'text-[#0056D2]' : 'text-slate-700 hover:text-[#0056D2]'
                  }`}
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center text-[11px] font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate max-w-[120px]">
                    {user.name.split(' ')[0] || 'Profile'}
                  </span>
                  <CaretDown
                    size={12}
                    weight="bold"
                    className={`transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180 text-[#0056D2]' : 'text-slate-500'
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-[20%] top-[calc(100%+8px)] w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 text-xs"
                    >
                      {/* User Info: Name & Email */}
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      {/* Profile & Learning Links */}
                      <div className="space-y-0.5">
                        <Link
                          href="/my-learning"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
                        >
                          <BookOpen size={16} />
                          <span>My Learning Hub</span>
                        </Link>
                        <Link
                          href="/student/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
                        >
                          <User size={16} />
                          <span>Profile Settings</span>
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="pt-1 mt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false)
                            logout()
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition-colors cursor-pointer text-left"
                        >
                          <SignOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Not logged in: Log In Button */
              <button
                type="button"
                onClick={() => openAuth('step1')}
                className="px-4 py-2 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
              >
                Log In
              </button>
            )}

            {/* Mobile Drawer Toggle */}
            <div className="flex lg:hidden items-center ml-1">
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X size={22} /> : <List size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile Drawer ────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-[68px] bg-white border-b border-slate-200 shadow-xl z-40 p-5 lg:hidden font-['Inter'] max-h-[calc(100vh-68px)] overflow-y-auto"
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search available courses..."
                className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#0056D2] text-white flex items-center justify-center"
              >
                <MagnifyingGlass size={13} weight="bold" />
              </button>
            </form>

            <div className="space-y-1 mb-4 text-xs font-semibold text-slate-800">
              {user ? (
                <>
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span className={`font-semibold ${pathname === '/' ? 'text-[#0056D2] font-bold' : 'text-slate-800'}`}>
                      Home
                    </span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>

                  <Link
                    href="/my-learning"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-bold text-[#0056D2]">
                      <BookOpen size={16} weight="bold" />
                      <span>My learning</span>
                    </span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>

                  {/* Mobile Explore Specializations Collapsible / List */}
                  <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Explore Specializations
                    </span>
                    <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-blue-200">
                      {EXPLORE_CATEGORIES.map((track) => (
                        <Link
                          key={track.title}
                          href={`/courses?category=${encodeURIComponent(track.categoryKey)}`}
                          onClick={() => setMobileOpen(false)}
                          className="py-1 text-xs text-slate-700 hover:text-[#0056D2] flex items-center justify-between"
                        >
                          <span>{track.title}</span>
                          <ArrowRight size={11} className="text-slate-400" />
                        </Link>
                      ))}
                      <Link
                        href="/courses"
                        onClick={() => setMobileOpen(false)}
                        className="py-1 text-xs font-bold text-[#0056D2] hover:underline"
                      >
                        View All Programs →
                      </Link>
                    </div>
                  </div>

                  <Link
                    href="/blog"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span>Blog</span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>
                  <Link
                    href="/student/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <User size={16} className="text-slate-600" />
                      <span>Profile Settings</span>
                    </span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>
                </>
              ) : (
                <>
                  {/* Mobile Explore Specializations Collapsible / List */}
                  <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Explore Specializations
                    </span>
                    <div className="grid grid-cols-1 gap-1 pl-2 border-l-2 border-blue-200">
                      {EXPLORE_CATEGORIES.map((track) => (
                        <Link
                          key={track.title}
                          href={`/courses?category=${encodeURIComponent(track.categoryKey)}`}
                          onClick={() => setMobileOpen(false)}
                          className="py-1 text-xs text-slate-700 hover:text-[#0056D2] flex items-center justify-between"
                        >
                          <span>{track.title}</span>
                          <ArrowRight size={11} className="text-slate-400" />
                        </Link>
                      ))}
                      <Link
                        href="/courses"
                        onClick={() => setMobileOpen(false)}
                        className="py-1 text-xs font-bold text-[#0056D2] hover:underline"
                      >
                        View All Programs →
                      </Link>
                    </div>
                  </div>
                  <Link
                    href="/#why-us"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span>Why Learn With Us</span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>
                  <Link
                    href="/#methodology"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span>Learning Methodology</span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>
                  <Link
                    href="/#mentors"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span>Mentors &amp; Faculty</span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span>Engineering Blog &amp; Guides</span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>

                  {/* Enquiry Link in Mobile Drawer - Added Last */}
                  <Link
                    href="/#enquiry"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50 text-[#0056D2] font-bold transition-colors mt-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <ChatCircleDots size={16} weight="bold" />
                      <span>Course Enquiry &amp; Admissions</span>
                    </span>
                    <ArrowRight size={13} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Auth Bottom Section */}
            <div className="pt-3 border-t border-slate-100">
              {user ? (
                <div className="space-y-2">
                  <div className="px-2 py-1 text-xs">
                    <p className="font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      logout()
                    }}
                    className="w-full py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <SignOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuth('step1')}
                  className="w-full py-2.5 rounded-xl bg-[#0056D2] text-white text-xs font-bold shadow-xs flex items-center justify-center"
                >
                  Log In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universal 2-Step & OTP Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  )
}
