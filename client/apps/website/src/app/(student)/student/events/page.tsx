'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/common/Logo'
import { CalendarBlank, MapPin, CheckCircle, ArrowLeft, Users } from '@phosphor-icons/react'

interface EventItem {
  id: string
  title: string
  description: string
  category: string
  speaker: string
  speakerRole: string
  date: string
  time: string
  location: string
  attendees: number
  registered?: boolean
}

const DEMO_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'System Design at Scale: Microservices with AWS',
    description: 'Learn how to architect high-throughput distributed systems using AWS ECS, Redis caching, and Kafka streaming.',
    category: 'Cloud & Architecture',
    speaker: 'Sneha Patel',
    speakerRole: 'Staff Cloud Architect @ AWS',
    date: 'Nov 18, 2026',
    time: '6:00 PM - 7:30 PM IST',
    location: 'Online (Zoom Room)',
    attendees: 184,
    registered: true,
  },
  {
    id: '2',
    title: 'Cracking Modern Full-Stack Interviews in 2026',
    description: 'A deep-dive into full-stack coding rounds, Next.js hydration challenges, SQL optimization, and live mock interview breakdowns.',
    category: 'Full Stack',
    speaker: 'Ravi Kumar',
    speakerRole: 'Lead Software Engineer',
    date: 'Nov 22, 2026',
    time: '11:00 AM - 1:00 PM IST',
    location: 'Live Stream & Q&A',
    attendees: 312,
  },
  {
    id: '3',
    title: 'Generative AI & LLM App Development Workshop',
    description: 'Hands-on live coding: Build production-grade RAG applications using LangChain, pgvector, and OpenAI API.',
    category: 'AI & Data Science',
    speaker: 'Priya Sharma',
    speakerRole: 'Senior ML Engineer',
    date: 'Nov 29, 2026',
    time: '4:00 PM - 6:00 PM IST',
    location: 'Interactive Lab',
    attendees: 245,
  },
]

export default function StudentEventsPage() {
  const [events, setEvents] = useState<EventItem[]>(DEMO_EVENTS)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Full Stack', 'Cloud & Architecture', 'AI & Data Science']

  const handleRegister = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, registered: true, attendees: e.attendees + 1 } : e))
    )
  }

  const filteredEvents =
    selectedCategory === 'All'
      ? events
      : events.filter((e) => e.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#F0F6FF] font-inter">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/student/dashboard" className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100">
              <ArrowLeft size={18} />
            </Link>
            <Logo />
            <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-[#155EEF] border border-blue-100">
              Tech Workshops
            </span>
          </div>

          <Link
            href="/student/dashboard"
            className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101B3C] font-display">
            Upcoming Career Workshops & Masterclasses
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Free live cohorts led by principal engineers from top tier tech companies.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#155EEF] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-[#155EEF]">
                    {evt.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Users size={14} /> {evt.attendees} registered
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#101B3C] leading-snug">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {evt.description}
                </p>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                  <div className="font-semibold text-slate-800">
                    Speaker: <span className="font-normal text-slate-600">{evt.speaker} ({evt.speakerRole})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarBlank size={14} className="text-[#155EEF]" />
                    <span>{evt.date} • {evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#155EEF]" />
                    <span>{evt.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                {evt.registered ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center justify-center gap-1.5 cursor-default"
                  >
                    <CheckCircle size={16} weight="fill" />
                    <span>Seat Reserved</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(evt.id)}
                    className="w-full py-2.5 rounded-xl bg-[#155EEF] hover:bg-[#124BBF] text-white text-xs font-bold transition-all shadow-xs active:scale-[0.99] cursor-pointer"
                  >
                    Reserve Free Seat
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
