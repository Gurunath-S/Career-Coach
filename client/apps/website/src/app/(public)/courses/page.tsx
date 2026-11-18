'use client'

import React, { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { COURSES } from '@/lib/constants'
import { apiService } from '@/services/api'
import type { Course } from '@careercatch/shared-types'
import {
  Star,
  Clock,
  GraduationCap,
  MagnifyingGlass,
  Funnel,
  ArrowRight,
  SlidersHorizontal,
  X,
} from '@phosphor-icons/react'

const TOPIC_PILLS_BY_CATEGORY: Record<string, string[]> = {
  'Data Science': [
    'Python',
    'Machine Learning',
    'Data Analysis',
    'SQL',
    'Deep Learning',
    'Artificial Intelligence',
    'Tableau',
    'R Programming',
    'Generative AI',
  ],
  'Full Stack': [
    'React',
    'Node.js',
    'TypeScript',
    'Next.js',
    'PostgreSQL',
    'System Design',
    'Docker',
    'REST APIs',
  ],
  'UI/UX Design': [
    'Figma',
    'Design Systems',
    'User Research',
    'Wireframing',
    'Prototyping',
    'Mobile UI',
    'Web Accessibility',
  ],
  'Cloud Computing': [
    'AWS',
    'Docker',
    'Kubernetes',
    'Terraform',
    'CI/CD',
    'Cloud Security',
    'DevOps',
  ],
  'DevOps': [
    'CI/CD Pipelines',
    'Kubernetes',
    'Docker',
    'Linux',
    'Monitoring',
    'Automation',
    'GitOps',
  ],
}

const DEFAULT_TOPIC_PILLS = [
  'Python',
  'React',
  'Data Science',
  'Full Stack',
  'Machine Learning',
  'AWS Cloud',
  'Figma UI/UX',
  'DevOps',
  'Artificial Intelligence',
]

// Partner badge styling
function getPartnerBadge(partner?: string) {
  switch (partner) {
    case 'Google':
      return {
        name: 'Google',
        bg: 'bg-white',
        border: 'border-slate-200',
        text: 'text-[#4285F4]',
        badgeBg: 'bg-blue-50 text-[#1A73E8]',
      }
    case 'IBM':
      return {
        name: 'IBM',
        bg: 'bg-[#002D9C] text-white',
        border: 'border-[#002D9C]',
        text: 'text-[#002D9C]',
        badgeBg: 'bg-blue-50 text-[#002D9C]',
      }
    case 'DeepLearning.AI':
      return {
        name: 'DeepLearning.AI',
        bg: 'bg-[#FF4F00] text-white',
        border: 'border-orange-200',
        text: 'text-[#FF4F00]',
        badgeBg: 'bg-orange-50 text-[#FF4F00]',
      }
    case 'University of Michigan':
      return {
        name: 'Univ. of Michigan',
        bg: 'bg-[#00274C] text-[#FFCB05]',
        border: 'border-[#00274C]',
        text: 'text-[#00274C]',
        badgeBg: 'bg-amber-50 text-[#00274C]',
      }
    default:
      return {
        name: 'CareerCatch',
        bg: 'bg-[#0056D2] text-white',
        border: 'border-blue-200',
        text: 'text-[#0056D2]',
        badgeBg: 'bg-blue-50 text-[#0056D2]',
      }
  }
}

function CoursesPageContent() {
  const searchParams = useSearchParams()
  const rawCategoryParam = searchParams.get('category') || ''
  const rawSearchParam = searchParams.get('search') || ''

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(rawCategoryParam)
  const [searchQuery, setSearchQuery] = useState<string>(rawSearchParam)
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<string>('All')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [selectedDuration, setSelectedDuration] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const [courses, setCourses] = useState<Course[]>(COURSES)
  const [loadingDb, setLoadingDb] = useState(false)

  // Fetch live courses from database via API
  React.useEffect(() => {
    let active = true
    async function loadDbCourses() {
      try {
        setLoadingDb(true)
        const data = await apiService.getCourses()
        if (active && data && data.length > 0) {
          setCourses(data)
        }
      } catch (err) {
        console.error('Failed to load courses from DB:', err)
      } finally {
        if (active) setLoadingDb(false)
      }
    }
    loadDbCourses()
    return () => {
      active = false
    }
  }, [])

  // Update category when URL param changes
  React.useEffect(() => {
    if (rawCategoryParam) {
      setSelectedCategory(rawCategoryParam)
    }
  }, [rawCategoryParam])

  React.useEffect(() => {
    if (rawSearchParam) {
      setSearchQuery(rawSearchParam)
    }
  }, [rawSearchParam])

  // Topics for the active category
  const activeTopics = useMemo(() => {
    if (selectedCategory && TOPIC_PILLS_BY_CATEGORY[selectedCategory]) {
      return TOPIC_PILLS_BY_CATEGORY[selectedCategory]
    }
    return DEFAULT_TOPIC_PILLS
  }, [selectedCategory])

  // Filtered course dataset
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'All') {
        const catMatch =
          c.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          selectedCategory.toLowerCase().includes(c.category.toLowerCase())
        if (!catMatch) return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = c.title.toLowerCase().includes(q)
        const matchCat = c.category.toLowerCase().includes(q)
        const matchPartner = c.partner?.toLowerCase().includes(q)
        const matchSkills = (c.skills || []).some((s) => s.toLowerCase().includes(q))
        if (!matchTitle && !matchCat && !matchPartner && !matchSkills) return false
      }

      // Topic pill filter
      if (selectedTopic) {
        const t = selectedTopic.toLowerCase()
        const matchTitle = c.title.toLowerCase().includes(t)
        const matchSkills = (c.skills || []).some((s) => s.toLowerCase().includes(t))
        if (!matchTitle && !matchSkills) return false
      }

      // Level filter (case-insensitive for both DB enum and string)
      if (selectedLevel !== 'All') {
        if (c.level?.toLowerCase() !== selectedLevel.toLowerCase()) return false
      }

      // Type filter
      if (selectedType !== 'All') {
        if (c.certificateType !== selectedType) return false
      }

      // Duration filter
      if (selectedDuration !== 'All') {
        if (selectedDuration === '1-3 Months' && !c.duration.includes('3 Months') && !c.duration.includes('Hours')) return false
        if (selectedDuration === '3-6 Months' && !c.duration.includes('4 Months') && !c.duration.includes('5 Months') && !c.duration.includes('6 Months')) return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      if (sortBy === 'newest') return b.id - a.id
      return (b.reviews || 0) - (a.reviews || 0)
    })
  }, [courses, selectedCategory, searchQuery, selectedTopic, selectedLevel, selectedType, selectedDuration, sortBy])

  const clearAllFilters = () => {
    setSelectedCategory('')
    setSearchQuery('')
    setSelectedTopic('')
    setSelectedLevel('All')
    setSelectedType('All')
    setSelectedDuration('All')
  }

  // Active Category Title
  const activeTitle = selectedCategory || 'All Courses & Specializations'
  const activeDescription = selectedCategory
    ? `Learn ${selectedCategory} or advance your tech career online today. Choose from high-impact live cohorts and industry-standard specializations.`
    : 'Choose from a wide range of industry-aligned tech courses and live cohorts with verified credentials and expert mentorship.'

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-['Inter'] text-slate-800">
      <Navbar />

      {/* ─── Breadcrumb Navigation ─────────────────────────────────── */}
      <Breadcrumbs
        items={[
          { label: 'Categories', href: '/courses' },
          ...(selectedCategory ? [{ label: selectedCategory }] : []),
        ]}
      />

      {/* ─── Category Hero Banner (Coursera Image 2 Style) ─────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#101B3C] font-['Plus_Jakarta_Sans'] tracking-tight">
              {activeTitle}
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              {activeDescription}
            </p>
          </div>

          {/* Topic Pills */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {activeTopics.map((topic) => {
              const isActive = selectedTopic === topic
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(isActive ? '' : topic)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-[#0056D2] text-white border-[#0056D2] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {topic}
                  {isActive && <span className="ml-1.5 font-bold">×</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── Main 2-Column Catalog Section ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between pb-5 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">
              Showing <span className="font-bold text-slate-900">{filteredCourses.length}</span> programs
            </span>
            {(selectedCategory || selectedTopic || selectedLevel !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-[#0056D2] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Sort By & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 shadow-2xs"
            >
              <Funnel size={14} weight="bold" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <span className="hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#0056D2] cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* ─── LEFT: Filters Sidebar (Coursera Image 2 Style) ──────── */}
          <aside
            className={`${
              mobileFilterOpen ? 'block' : 'hidden'
            } lg:block lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <SlidersHorizontal size={16} weight="bold" className="text-[#0056D2]" />
                <span>Filter by</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="lg:hidden text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Keyword Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Python, React..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2]"
                />
                <MagnifyingGlass
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* Specialization / Subject Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wider">
                Subject Category
              </label>
              <div className="space-y-1.5 text-xs">
                {['All', 'Data Science', 'Full Stack', 'UI/UX Design', 'Cloud Computing', 'DevOps'].map((cat) => {
                  const isChecked = (!selectedCategory && cat === 'All') || selectedCategory === cat
                  return (
                    <label
                      key={cat}
                      className="flex items-center justify-between py-1 px-1 rounded-md hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="categoryFilter"
                          checked={isChecked}
                          onChange={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                          className="text-[#0056D2] focus:ring-[#0056D2]"
                        />
                        <span className={`text-slate-700 ${isChecked ? 'font-bold text-[#0056D2]' : ''}`}>
                          {cat}
                        </span>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wider">
                Skill Level
              </label>
              <div className="space-y-1.5 text-xs">
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => {
                  const isChecked = selectedLevel === lvl
                  return (
                    <label
                      key={lvl}
                      className="flex items-center gap-2 py-1 px-1 rounded-md hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="levelFilter"
                        checked={isChecked}
                        onChange={() => setSelectedLevel(lvl)}
                        className="text-[#0056D2] focus:ring-[#0056D2]"
                      />
                      <span className={`text-slate-700 ${isChecked ? 'font-bold text-[#0056D2]' : ''}`}>
                        {lvl}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Credential Format */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wider">
                Credential Type
              </label>
              <div className="space-y-1.5 text-xs">
                {['All', 'Professional Certificate', 'Specialization', 'Course'].map((type) => {
                  const isChecked = selectedType === type
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-2 py-1 px-1 rounded-md hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="typeFilter"
                        checked={isChecked}
                        onChange={() => setSelectedType(type)}
                        className="text-[#0056D2] focus:ring-[#0056D2]"
                      />
                      <span className={`text-slate-700 ${isChecked ? 'font-bold text-[#0056D2]' : ''}`}>
                        {type}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Duration */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wider">
                Duration
              </label>
              <div className="space-y-1.5 text-xs">
                {['All', '1-3 Months', '3-6 Months'].map((dur) => {
                  const isChecked = selectedDuration === dur
                  return (
                    <label
                      key={dur}
                      className="flex items-center gap-2 py-1 px-1 rounded-md hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="durationFilter"
                        checked={isChecked}
                        onChange={() => setSelectedDuration(dur)}
                        className="text-[#0056D2] focus:ring-[#0056D2]"
                      />
                      <span className={`text-slate-700 ${isChecked ? 'font-bold text-[#0056D2]' : ''}`}>
                        {dur}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* ─── RIGHT: Course Grid (Coursera Image 2 Style) ─────────── */}
          <main className="lg:col-span-3">
            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0056D2] mx-auto flex items-center justify-center mb-3">
                  <Funnel size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">No matching programs found</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-4">
                  We could not find programs matching your current filter selection. Try resetting filters.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded-xl bg-[#0056D2] text-white text-xs font-bold hover:bg-[#00419e] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredCourses.map((c) => {
                  const badge = getPartnerBadge(c.partner)
                  const targetSlug = c.slug || String(c.id)

                  return (
                    <Link
                      key={c.id}
                      href={`/courses/${targetSlug}`}
                      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400/80 shadow-2xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
                    >
                      {/* Course Thumbnail Image Header */}
                      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 block">
                        {c.thumbnail ? (
                          <img
                            src={c.thumbnail}
                            alt={c.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-xs uppercase">
                            {c.category}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2 pointer-events-none">
                          <div className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${badge.badgeBg} border-white/60 shadow-xs truncate`}>
                            {c.partner || 'CareerCatch'}
                          </div>
                          <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider bg-white/95 backdrop-blur-md px-2 py-0.5 rounded shadow-xs border border-white/60 shrink-0">
                            {c.certificateType || 'Certificate'}
                          </span>
                        </div>

                        {/* Bottom Track Pill on Thumbnail */}
                        <div className="absolute bottom-2.5 left-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-md">
                            {c.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="text-sm sm:text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 group-hover:text-[#0056D2] transition-colors line-clamp-2 leading-snug">
                            {c.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            Instructor: {c.instructor}
                          </p>
                        </div>

                        {/* Skills gain tags */}
                        {c.skills && c.skills.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                              Skills you&apos;ll gain:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {c.skills.slice(0, 3).map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                              {c.skills.length > 3 && (
                                <span className="text-[10px] text-slate-400 self-center">
                                  +{c.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Rating & Level */}
                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs">
                            <div className="flex items-center text-amber-500 font-bold">
                              <Star size={14} weight="fill" />
                              <span className="ml-1 text-slate-900">{c.rating || 4.8}</span>
                            </div>
                            <span className="text-slate-400">
                              ({(c.reviews || 240).toLocaleString()} reviews)
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <div className="flex items-center gap-1">
                              <GraduationCap size={13} className="text-blue-600" />
                              <span>{c.level}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={13} className="text-blue-600" />
                              <span className="truncate max-w-[120px]">{c.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer / Action */}
                      <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 line-through mr-1.5">
                            ₹{c.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="font-bold text-slate-900">
                            ₹{c.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="font-bold text-[#0056D2] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>View Program</span>
                          <ArrowRight size={13} weight="bold" />
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
          <Navbar />
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading learning tracks...</p>
          </div>
          <Footer />
        </div>
      }
    >
      <CoursesPageContent />
    </Suspense>
  )
}
