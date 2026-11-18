'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingEnrollButton from '@/components/common/FloatingEnrollButton'
import HeroBanner from '@/components/sections/HeroBanner'
import Introduction from '@/components/sections/Introduction'
import PopularCourses from '@/components/sections/PopularCourses'
import TechnologiesMarquee from '@/components/sections/TechnologiesMarquee'
import WhyLearnWithUs from '@/components/sections/WhyLearnWithUs'
import LearningMethodology from '@/components/sections/LearningMethodology'
import CourseHighlights from '@/components/sections/CourseHighlights'
import HandsOnProjects from '@/components/sections/HandsOnProjects'
import IndustrySkills from '@/components/sections/IndustrySkills'
import StudentAchievements from '@/components/sections/StudentAchievements'
import TrainersMentors from '@/components/sections/TrainersMentors'
import Testimonials from '@/components/sections/Testimonials'
import CareerOpportunities from '@/components/sections/CareerOpportunities'
import FAQ from '@/components/sections/FAQ'
import EnquiryCTA from '@/components/sections/EnquiryCTA'
import { useStudentAuth } from '@/context/StudentAuthContext'
import { BookOpen, Sparkle, ArrowRight, Certificate } from '@phosphor-icons/react'

export default function HomePage() {
  const { user } = useStudentAuth()

  return (
    <>
      <Navbar />

      <main>
        {user ? (
          /* ─── Logged-In Student Experience: Focused on Courses, Curriculum & Learning ─── */
          <>
            {/* Learner Welcome Hub Bar */}
            <div className="bg-gradient-to-r from-[#101B3C] via-[#122B60] to-[#155EEF] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-blue-900 font-inter">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
                    <Sparkle size={14} weight="fill" className="text-amber-400" />
                    <span>Active Student Portal</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight">
                    Welcome back, {user.name.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-sm text-blue-100 max-w-xl">
                    Explore available courses, resume your active modules, or attend upcoming live cohort masterclasses.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/student/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#155EEF] hover:bg-blue-50 font-bold text-xs sm:text-sm transition-all shadow-md"
                  >
                    <BookOpen size={16} weight="bold" />
                    <span>Go to My Dashboard</span>
                    <ArrowRight size={14} weight="bold" />
                  </Link>
                  <Link
                    href="/student/dashboard?tab=certificates"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all"
                  >
                    <Certificate size={16} />
                    <span>My Certificates</span>
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all"
                  >
                    <BookOpen size={16} />
                    <span>Tech Blog</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* S02: Available Courses & Specializations */}
            <PopularCourses />

            {/* S11: Hands-on Projects */}
            <HandsOnProjects />

            {/* S07: Technologies We Teach */}
            <TechnologiesMarquee />

            {/* S12: Industry-Relevant Skills */}
            <IndustrySkills />

            {/* S14: Trainers / Mentors */}
            <TrainersMentors />

            {/* S17: Frequently Asked Questions */}
            <FAQ />
          </>
        ) : (
          /* ─── Non-Logged-In Visitor Experience: Full Public Marketing Page ─── */
          <>
            {/* S01: Hero Banner */}
            <HeroBanner />

            {/* S02: Popular Courses */}
            <PopularCourses />

            {/* S03: Introduction */}
            <Introduction />

            {/* S07: Technologies We Teach */}
            <TechnologiesMarquee />

            {/* S08: Why Learn With Us */}
            <WhyLearnWithUs />

            {/* S09: Learning Methodology */}
            <LearningMethodology />

            {/* S10: Course Highlights */}
            <CourseHighlights />

            {/* S11: Hands-on Projects */}
            <HandsOnProjects />

            {/* S12: Industry-Relevant Skills */}
            <IndustrySkills />

            {/* S13: Student Achievements */}
            <StudentAchievements />

            {/* S14: Trainers / Mentors */}
            <TrainersMentors />

            {/* S15: Student Testimonials */}
            <Testimonials />

            {/* S16: Career Opportunities */}
            <CareerOpportunities />

            {/* S17: Frequently Asked Questions */}
            <FAQ />

            {/* S18: Enquiry / Join Now CTA */}
            <EnquiryCTA />
          </>
        )}
      </main>

      {/* S19: Footer */}
      <Footer />

      {/* Floating Sticky Enroll CTA (Automatically hidden for logged-in students) */}
      <FloatingEnrollButton />
    </>
  )
}
