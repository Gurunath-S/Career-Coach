'use client'

import React, { use } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingEnrollButton from '@/components/common/FloatingEnrollButton'
import { BLOG_POSTS } from '@/lib/blogData'
import {
  CalendarBlank,
  Clock,
  ArrowLeft,
  ArrowRight,
  ShareNetwork,
  CheckCircle,
  GraduationCap,
  Sparkle,
} from '@phosphor-icons/react'

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug) || BLOG_POSTS[0]

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post?.slug).slice(0, 3)

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#F8FAFC] py-20 px-4 text-center font-inter">
          <div className="max-w-md mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">Article Not Found</h1>
            <p className="text-sm text-slate-500">The requested article could not be located.</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#155EEF] text-white text-xs font-bold"
            >
              <ArrowLeft size={14} />
              <span>Back to All Articles</span>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href)
      alert('Article link copied to clipboard!')
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F8FAFC] font-inter">
        {/* Article Header & Breadcrumbs */}
        <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-blue-600">Blog</Link>
              <span>/</span>
              <span className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-xs">{post.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#155EEF] border border-blue-200">
                {post.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock size={13} className="text-[#155EEF]" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display text-[#101B3C] leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author card & publish info */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">{post.author.name}</p>
                  <p className="text-xs text-slate-500">{post.author.role} • {post.author.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <CalendarBlank size={14} className="text-[#155EEF]" />
                  {post.publishedAt}
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                  title="Share article link"
                >
                  <ShareNetwork size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 pt-6">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-h-[420px] bg-slate-100">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Body Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-serif">
            {post.content.introduction}
          </p>

          {post.content.sections.map((section, idx) => (
            <div key={idx} className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#101B3C]">
                {section.heading}
              </h2>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {section.body}
              </p>

              {section.codeSnippet && (
                <div className="rounded-xl overflow-hidden bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto shadow-inner">
                  <pre>
                    <code>{section.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {section.takeaways && section.takeaways.length > 0 && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                  <span className="text-xs font-bold text-[#155EEF] uppercase tracking-wider block">
                    Key Architectural Takeaways:
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                    {section.takeaways.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <CheckCircle size={16} weight="fill" className="text-[#155EEF] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Conclusion */}
          <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-slate-900">Summary &amp; Next Steps</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {post.content.conclusion}
            </p>
          </div>

          {/* Related Course Promotion Box */}
          <div className="bg-gradient-to-br from-[#101B3C] to-[#155EEF] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
                <Sparkle size={13} weight="fill" className="text-amber-400" />
                Industry Programs
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-display">
                Ready to master these skills with senior mentors?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-md">
                Build real production systems, receive code reviews, and earn verifiable certifications.
              </p>
            </div>
            <Link
              href="/courses"
              className="px-5 py-3 rounded-xl bg-white text-[#155EEF] hover:bg-blue-50 font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 text-center flex items-center justify-center gap-2"
            >
              <GraduationCap size={18} weight="bold" />
              <span>Explore Programs</span>
            </Link>
          </div>

          {/* Read Next Section */}
          <div className="pt-10 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Read Next</h3>
              <Link href="/blog" className="text-xs font-bold text-[#155EEF] hover:underline flex items-center gap-1">
                <span>View all articles</span>
                <ArrowRight size={13} weight="bold" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all space-y-2 group flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[#155EEF] bg-blue-50 px-2 py-0.5 rounded">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 block">{rel.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingEnrollButton />
    </>
  )
}
