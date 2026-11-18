'use client'

import React from 'react'
import {
  BookOpen,
  Code,
  MagnifyingGlass,
  RocketLaunch,
  CheckCircle,
  GitPullRequest,
  Star,
  Trophy,
  ArrowUpRight,
  Clock,
  Sparkle,
  ShieldCheck,
  Cpu,
} from '@phosphor-icons/react'
import { METHODOLOGY_STEPS } from '@/lib/constants'

const STEP_THEMES = [
  {
    accent: '#1D4ED8', // Deep Royal Blue
    badgeBg: '#EFF6FF',
    badgeBorder: '#BFDBFE',
    badgeText: '#1E40AF',
    tagBg: '#DBEAFE',
    dotColor: '#2563EB',
    panelBg: '#F8FAFC',
    panelBorder: '#E2E8F0',
  },
  {
    accent: '#7C3AED', // Deep Royal Violet
    badgeBg: '#F5F3FF',
    badgeBorder: '#DDD6FE',
    badgeText: '#6D28D9',
    tagBg: '#EDE9FE',
    dotColor: '#8B5CF6',
    panelBg: '#F8FAFC',
    panelBorder: '#E2E8F0',
  },
  {
    accent: '#059669', // Deep Emerald
    badgeBg: '#ECFDF5',
    badgeBorder: '#A7F3D0',
    badgeText: '#047857',
    tagBg: '#D1FAE5',
    dotColor: '#10B981',
    panelBg: '#F8FAFC',
    panelBorder: '#E2E8F0',
  },
  {
    accent: '#D97706', // Warm Amber
    badgeBg: '#FFFBEB',
    badgeBorder: '#FDE68A',
    badgeText: '#B45309',
    tagBg: '#FEF3C7',
    dotColor: '#F59E0B',
    panelBg: '#F8FAFC',
    panelBorder: '#E2E8F0',
  },
]

const ICON_MAP = {
  BookOpen,
  Code,
  MagnifyingGlass,
  RocketLaunch,
}

// Crisp, high-contrast preview widgets tailored for light mode
function StepPreviewPanel({ stepIndex }: { stepIndex: number }) {
  if (stepIndex === 0) {
    // Step 01: Learn - Live Cohort & Module Breakdown
    return (
      <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
              Cohort 14 • Live Now
            </span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
            Week 3 of 16
          </span>
        </div>

        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Current Module
          </p>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center justify-between">
            <span>Distributed Systems &amp; High-Scale APIs</span>
            <ArrowUpRight size={16} className="text-slate-400" />
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Led by Staff Engineer @ Uber &amp; ex-Amazon Lead
          </p>
        </div>

        <div className="space-y-2 mt-1">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <CheckCircle size={15} weight="fill" className="text-emerald-600 shrink-0" />
              <span>Foundations &amp; Concurrency Models</span>
            </div>
            <span className="text-slate-500 text-[11px] font-mono">Completed</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/80 border border-blue-200 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-semibold">
              <Clock size={15} weight="bold" className="text-blue-600 shrink-0" />
              <span>Redis Caching &amp; Latency Optimization</span>
            </div>
            <span className="text-blue-700 text-[11px] font-mono font-bold">In Session</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Cpu size={15} className="text-slate-400 shrink-0" />
              <span>Kafka Event Streams &amp; Resilience</span>
            </div>
            <span className="text-slate-500 text-[11px] font-mono">Next Week</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>Cohort Progress</span>
          <span className="font-bold text-blue-700">76% Completed</span>
        </div>
      </div>
    )
  }

  if (stepIndex === 1) {
    // Step 02: Build - Production PR & Code Inspector
    return (
      <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2">
            <GitPullRequest size={17} weight="bold" className="text-purple-600" />
            <span className="text-xs font-mono font-bold text-slate-800">
              PR #42 • careercatch-labs
            </span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
            Merged to Main
          </span>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 leading-snug">
            feat(cache): Multi-tier Redis caching layer with stale-while-revalidate
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
            <span className="text-emerald-700 font-bold">+1,420</span>
            <span className="text-rose-700 font-bold">-185</span>
            <span>• 18 files changed</span>
          </div>
        </div>

        {/* Stack tags */}
        <div className="flex flex-wrap gap-1.5 my-1">
          {['TypeScript', 'PostgreSQL 16', 'Docker', 'Redis 7.2', 'Jest CI'].map((t) => (
            <span
              key={t}
              className="text-[11px] font-medium px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Automated Quality Gate */}
        <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-purple-950 font-semibold">
            <span>Automated CI Quality Gate</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle size={14} weight="fill" /> All Checks Passing
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-purple-800">
            <span>Unit &amp; Integration Coverage</span>
            <span className="font-mono font-bold">94.8%</span>
          </div>
        </div>
      </div>
    )
  }

  if (stepIndex === 2) {
    // Step 03: Review - Mentor Rubric Scorecard
    return (
      <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} weight="fill" className="text-emerald-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Architecture Scorecard
            </span>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Top Tier (9.4 / 10)
          </span>
        </div>

        <div className="space-y-2.5">
          {[
            { metric: 'Code Modularity & Clean Patterns', score: 9.6, pct: 96 },
            { metric: 'Database Schema & Query Efficiency', score: 9.2, pct: 92 },
            { metric: 'Security & Auth Sanitization', score: 9.5, pct: 95 },
            { metric: 'Test Coverage & Error Boundaries', score: 9.3, pct: 93 },
          ].map((m) => (
            <div key={m.metric}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">{m.metric}</span>
                <span className="font-mono font-bold text-slate-900">{m.score}/10</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${m.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 p-3 rounded-xl bg-white border border-slate-200 text-xs">
          <div className="flex items-center gap-2 mb-1 text-slate-900 font-bold">
            <Star size={14} weight="fill" className="text-amber-500" />
            <span>Mentor Feedback Summary</span>
          </div>
          <p className="text-slate-600 italic leading-relaxed text-[11px]">
            &ldquo;Exceptional mastery of modular error handling. Architecture demonstrates SDE-2 level maturity ready for direct referral.&rdquo;
          </p>
        </div>
      </div>
    )
  }

  // Step 04: Launch - Direct Recruiter Placement
  return (
    <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <Trophy size={18} weight="fill" className="text-amber-500" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Placement Pipeline
          </span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
          Offers Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-3 rounded-xl bg-white border border-slate-200">
          <span className="text-xl font-extrabold text-amber-600 block leading-tight">₹14.5 LPA</span>
          <span className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5 block">Average Offer</span>
        </div>
        <div className="p-3 rounded-xl bg-white border border-slate-200">
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">200+</span>
          <span className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5 block">Hiring Partners</span>
        </div>
      </div>

      <div className="space-y-2 mt-1">
        {[
          { name: 'CRED', role: 'Full Stack Engineer', status: 'Offer Received' },
          { name: 'PhonePe', role: 'Backend SDE', status: 'Final Round' },
          { name: 'Groww', role: 'Frontend Architect', status: 'Shortlisted' },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-900 block leading-tight">{item.name}</span>
              <span className="text-[11px] text-slate-500">{item.role}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LearningMethodology() {
  return (
    <section
      id="methodology"
      className="relative bg-gradient-to-b from-slate-50 via-slate-100/40 to-slate-50 border-t border-b border-slate-200/80 py-16 md:py-24"
    >
      {/* Section header */}
      <div className="container text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-3.5 shadow-2xs">
          <Sparkle size={13} weight="fill" className="text-blue-600" />
          <span>How It Works</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-3.5">
          A System That Gets You Hired
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Four deliberate phases engineered by hiring leaders to turn raw motivation into production-ready software engineering mastery.
        </p>
      </div>

      {/* ─── Hardware-Accelerated CSS Sticky Stacking Cards (Zero Scroll Lag) ─── */}
      <div className="container max-w-5xl space-y-8 sm:space-y-12">
        {METHODOLOGY_STEPS.map((step, i) => {
          const theme = STEP_THEMES[i]
          const IconComponent = ICON_MAP[step.icon as keyof typeof ICON_MAP]

          return (
            <div
              key={step.step}
              className="sticky transition-all duration-200"
              style={{
                top: `${88 + i * 20}px`,
                zIndex: 10 + i,
              }}
            >
              {/* Outer Card with Crisp Border and Solid High-Contrast Shadow */}
              <div className="rounded-3xl p-2 sm:p-2.5 bg-slate-100 border border-slate-300/80 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Content Column: Crisp, High-Contrast Text (100% Opacity) */}
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs"
                        style={{
                          background: theme.badgeBg,
                          borderColor: theme.badgeBorder,
                        }}
                      >
                        {IconComponent && (
                          <IconComponent size={26} color={theme.accent} weight="duotone" />
                        )}
                      </div>
                      <span
                        className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs"
                        style={{
                          background: theme.badgeBg,
                          borderColor: theme.badgeBorder,
                          color: theme.badgeText,
                        }}
                      >
                        Step {step.step}
                      </span>
                    </div>

                    <h3 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base font-semibold text-slate-700 mb-3">
                      {step.subtitle}
                    </p>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl">
                      {step.body}
                    </p>

                    {/* Key Pillars Badges */}
                    <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Focus:</span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                        {i === 0 && 'Cohort Live Mentoring'}
                        {i === 1 && 'Production Git Repositories'}
                        {i === 2 && 'Senior Engineer Rubrics'}
                        {i === 3 && 'Direct Hiring Pipeline'}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                        {i === 0 && 'Industry Curriculum'}
                        {i === 1 && 'System Design Architecture'}
                        {i === 2 && 'Personalized Feedback'}
                        {i === 3 && 'Offer Negotiation'}
                      </span>
                    </div>
                  </div>

                  {/* Right Interactive Preview Column */}
                  <div className="lg:col-span-5">
                    <StepPreviewPanel stepIndex={i} />
                  </div>

                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
