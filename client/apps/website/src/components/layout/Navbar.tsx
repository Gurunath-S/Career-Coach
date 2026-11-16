'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  List,
  X,
  CaretDown,
  MagnifyingGlass,
  Sparkle,
  User,
  SignOut,
  Code,
  ChartLine,
  PenNib,
  Cloud,
  DeviceMobile,
  ShieldCheck,
} from '@phosphor-icons/react'
import Logo from '../common/Logo'
import { useStudentAuth } from '@/context/StudentAuthContext'
import { AuthModal } from '../modals/AuthModal'

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
    title: '1:1 Mentorship Tracks',
    desc: 'Mock Interviews, Code Reviews & Placement',
    categoryKey: 'Full Stack',
    icon: ShieldCheck,
    color: '#0284C7',
  },
]

export default function Navbar() {
  const router = useRouter()
  const { user, logout } = useStudentAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Auth Modal state
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'step1' | 'signup' | 'login'>('step1')

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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExploreOpen(false)
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
        setAuthMode(auth)
        setAuthModalOpen(true)
      }
    }
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/courses')
    }
  }

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
    setMobileOpen(false)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 bg-white font-['Inter'] ${
          scrolled ? 'shadow-xs border-b border-slate-200/80' : 'border-b border-slate-200'
        }`}
        style={{ height: '68px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3 sm:gap-6">
          
          {/* ─── Left: Brand Logo & Explore ───────────────────────────── */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Logo className="shrink-0 flex items-center" />

            {/* Explore Dropdown (Coursera Style) */}
            <div
              ref={dropdownRef}
              className="relative hidden sm:block"
              onMouseEnter={() => setExploreOpen(true)}
              onMouseLeave={() => setExploreOpen(false)}
            >
              <button
                type="button"
                onClick={() => setExploreOpen(!exploreOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  exploreOpen
                    ? 'border-[#0056D2] bg-blue-50/60 text-[#0056D2]'
                    : 'border-slate-300 hover:border-slate-400 text-slate-700 bg-white'
                }`}
                aria-expanded={exploreOpen}
              >
                <span>Explore</span>
                <CaretDown
                  size={13}
                  weight="bold"
                  className={`transition-transform duration-200 ${
                    exploreOpen ? 'rotate-180 text-[#0056D2]' : 'text-slate-500'
                  }`}
                />
              </button>

              {/* Mega Dropdown Menu */}
              <AnimatePresence>
                {exploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-[calc(100%+8px)] w-88 md:w-[460px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50"
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
                            onClick={() => setExploreOpen(false)}
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
                      <span className="text-slate-500">Live Weekend Cohorts</span>
                      <Link
                        href="/courses"
                        onClick={() => setExploreOpen(false)}
                        className="font-bold text-[#0056D2] hover:underline"
                      >
                        View All Programs →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Link to Programs / Degrees */}
            <Link
              href="/courses"
              className="hidden lg:inline-block text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0056D2] transition-colors"
            >
              Programs
            </Link>
          </div>

          {/* ─── Center: Coursera Search Input ────────────────────────── */}
          <div className="flex-1 max-w-lg hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn?"
                className="w-full pl-4 pr-12 py-2 rounded-full border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20 transition-all bg-white"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0056D2] hover:bg-[#00419e] text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Search"
                aria-label="Search courses"
              >
                <MagnifyingGlass size={15} weight="bold" />
              </button>
            </form>
          </div>

          {/* ─── Right: Log In / Join for Free (Coursera Style) ───────── */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Sparkle badge */}
            <div className="hidden xl:flex items-center text-blue-600" title="AI Cohorts Active">
              <Sparkle size={18} weight="fill" className="text-blue-600" />
            </div>

            {user ? (
              /* User logged in: Profile & Dashboard */
              <div className="flex items-center gap-2">
                <Link
                  href="/student/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/80 hover:bg-blue-100/70 text-[#0056D2] text-xs sm:text-sm font-bold transition-all shadow-2xs"
                >
                  <User size={15} weight="bold" />
                  <span className="truncate max-w-[120px]">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <SignOut size={18} />
                </button>
              </div>
            ) : (
              /* Not logged in: Log In & Join for Free */
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0056D2] transition-colors cursor-pointer"
                >
                  Log In
                </button>

                <button
                  type="button"
                  onClick={() => openAuth('signup')}
                  className="px-3.5 py-1.5 rounded-lg border-2 border-[#0056D2] text-[#0056D2] hover:bg-blue-50 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs"
                >
                  Join for Free
                </button>
              </div>
            )}

            {/* Mobile Drawer Toggle */}
            <div className="flex md:hidden items-center ml-1">
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
            className="fixed inset-x-0 top-[68px] bg-white border-b border-slate-200 shadow-xl z-40 p-5 md:hidden font-['Inter']"
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn?"
                className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#0056D2] text-white flex items-center justify-center"
              >
                <MagnifyingGlass size={13} weight="bold" />
              </button>
            </form>

            <div className="space-y-1 mb-4">
              <Link
                href="/courses"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                All Programs
              </Link>
              {EXPLORE_CATEGORIES.map((c) => (
                <Link
                  key={c.title}
                  href={`/courses?category=${encodeURIComponent(c.categoryKey)}`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  {c.title}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <Link
                  href="/student/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-blue-50 text-[#0056D2] font-bold text-xs"
                >
                  My Dashboard ({user.name.split(' ')[0]})
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openAuth('login')}
                    className="py-2.5 text-center rounded-xl border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuth('signup')}
                    className="py-2.5 text-center rounded-xl bg-[#0056D2] text-white font-bold text-xs cursor-pointer"
                  >
                    Join for Free
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal directly mounted in Navbar so Log In & Join for Free always work seamlessly */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  )
}
