'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingEnrollButton from '@/components/common/FloatingEnrollButton'
import { BLOG_POSTS, BlogPost } from '@/lib/blogData'
import {
  MagnifyingGlass,
  BookOpen,
  Clock,
  CalendarBlank,
  Tag,
  ArrowRight,
  Article,
  Sparkle,
} from '@phosphor-icons/react'

const CATEGORIES = ['All', 'Full Stack', 'System Design', 'AI & ML', 'Career Guide', 'Cloud & DevOps'] as const

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0]

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const q = searchQuery.trim().toLowerCase()
    const matchesQuery =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q))
    return matchesCategory && matchesQuery
  })

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F8FAFC] font-inter">
        {/* Header Hero Section */}
        <div className="bg-gradient-to-r from-[#101B3C] via-[#15346F] to-[#155EEF] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
              <Article size={14} weight="fill" className="text-amber-400" />
              CareerCatch Engineering &amp; Career Insights
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
              Tech Guides &amp; Architecture Insights
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-blue-100 leading-relaxed">
              In-depth articles on modern web engineering, system design, artificial intelligence, and developer interview roadmaps written by senior industry mentors.
            </p>

            {/* In-page Blog Search Bar */}
            <div className="max-w-md mx-auto pt-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, roadmaps, architecture..."
                  className="w-full pl-4 pr-11 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white placeholder:text-blue-200 focus:outline-none focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400 transition-all shadow-inner"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-200 pointer-events-none">
                  <MagnifyingGlass size={18} weight="bold" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#155EEF] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Hero Article (Shown when viewing "All" and no search query active) */}
          {selectedCategory === 'All' && !searchQuery && featuredPost && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#155EEF] border border-blue-200 flex items-center gap-1">
                        <Sparkle size={13} weight="fill" />
                        Featured Guide
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {featuredPost.category}
                      </span>
                    </div>

                    <Link href={`/blog/${featuredPost.slug}`}>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101B3C] group-hover:text-[#155EEF] transition-colors leading-tight">
                        {featuredPost.title}
                      </h2>
                    </Link>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {featuredPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-slate-900">{featuredPost.author.name}</p>
                        <p className="text-slate-500">{featuredPost.author.role}</p>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#155EEF] hover:underline"
                    >
                      <span>Read Guide</span>
                      <ArrowRight size={14} weight="bold" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-100 min-h-[260px] relative overflow-hidden">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Grid of Articles */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto shadow-xs">
              <BookOpen size={36} className="text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">No articles found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try selecting another category or clear your search query.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchQuery('')
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-blue-50 text-[#155EEF] text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <Link href={`/blog/${post.slug}`} className="block h-48 bg-slate-100 overflow-hidden relative">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 backdrop-blur-xs text-[#155EEF] shadow-xs">
                        {post.category}
                      </span>
                    </Link>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <CalendarBlank size={13} className="text-[#155EEF]" />
                          {post.publishedAt}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-[#155EEF]" />
                          {post.readTime}
                        </span>
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-base font-bold text-[#101B3C] group-hover:text-[#155EEF] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <span className="text-xs font-semibold text-slate-800 truncate max-w-[140px]">
                        {post.author.name}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-[#155EEF] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read</span>
                      <ArrowRight size={13} weight="bold" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingEnrollButton />
    </>
  )
}
