'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiService } from '@/services/api'
import { useStudentAuth } from '@/context/StudentAuthContext'
import { Event } from '@careercatch/shared-types'
import {
  CalendarBlank,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  CircleNotch,
  Sparkle,
  ArrowRight,
  ShieldCheck,
  WarningCircle,
} from '@phosphor-icons/react'

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user } = useStudentAuth()

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadEvent() {
      setLoading(true)
      const data = await apiService.getEventBySlug(resolvedParams.slug)
      setEvent(data)

      // If user is logged in, check if already registered
      if (data && user) {
        try {
          const userEvents = await apiService.getStudentEvents()
          const isReg = userEvents.some((reg: any) => reg.eventId === data.id)
          if (isReg) setRegistered(true)
        } catch {
          // ignore
        }
      }

      setLoading(false)
    }
    loadEvent()
  }, [resolvedParams.slug, user])

  const handleRegister = async () => {
    if (!event) return
    setError('')

    // If user is not logged in, redirect to login with return URL
    if (!user) {
      router.push(`/student/login?redirect=/events/${event.slug}`)
      return
    }

    setRegistering(true)
    try {
      await apiService.registerForEvent(event.id)
      setRegistered(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      setError(msg)
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading masterclass details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Event Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">The workshop or masterclass you requested could not be found.</p>
        <Link
          href="/events"
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
        >
          Browse All Events
        </Link>
      </div>
    )
  }

  const isFull = event.capacity ? event.registeredCount >= event.capacity : false
  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Event Header */}
      <section className="bg-[#101B3C] text-white py-14 md:py-20 relative overflow-hidden">
        <div className="container relative z-10 max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
            <Link href="/events" className="hover:underline">Events &amp; Workshops</Link>
            <span>/</span>
            <span>{event.location}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight mb-4">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 mt-4">
            <div className="flex items-center gap-2">
              <CalendarBlank size={18} className="text-blue-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-400" />
              <span>{event.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-blue-400" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Speaker */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 mb-4">
                About This Workshop
              </h2>
              <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>

              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-100">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Speaker Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center overflow-hidden shrink-0">
                {event.speakerAvatar ? (
                  <img src={event.speakerAvatar} alt={event.speakerName} className="w-full h-full object-cover" />
                ) : (
                  <Users size={32} className="text-blue-600" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Featured Speaker</span>
                <h3 className="text-lg font-bold text-slate-900">{event.speakerName}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {event.speakerRole} @ <strong className="text-slate-800">{event.speakerCompany}</strong>
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Leading this interactive masterclass with live practical demonstrations, architectural case studies, and an open Q&amp;A session.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Registration CTA Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-lg sticky top-24 space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {isFull ? 'Sold Out' : 'Free Registration'}
                </span>
                <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 mt-3">
                  Reserve Your Spot
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Access live Zoom room credentials, downloadable starter code, and Q&amp;A access.
                </p>
              </div>

              {error && (
                <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <WarningCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {registered ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle size={24} weight="fill" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-900">You Are Registered!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Your seat is confirmed. View details in your student dashboard.
                  </p>
                  <Link
                    href="/student/dashboard"
                    className="inline-block mt-3 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Go to Student Dashboard →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleRegister}
                    disabled={registering || isFull}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {registering ? (
                      <>
                        <CircleNotch className="animate-spin" size={16} />
                        <span>Registering...</span>
                      </>
                    ) : isFull ? (
                      <span>Capacity Full</span>
                    ) : (
                      <>
                        <Sparkle size={16} weight="fill" />
                        <span>{user ? 'Register for Free' : 'Sign In to Register'}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <Users size={15} />
                      <span>{event.registeredCount} enrolled</span>
                    </span>
                    {event.capacity && (
                      <span>{Math.max(0, event.capacity - event.registeredCount)} seats left</span>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-emerald-500" />
                  <span>100% Free Masterclass</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-emerald-500" />
                  <span>Interactive Live Q&amp;A with Speaker</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-emerald-500" />
                  <span>Participation Certificate Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
