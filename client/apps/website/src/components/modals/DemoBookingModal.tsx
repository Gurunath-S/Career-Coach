'use client'

import React, { useState, type FormEvent } from 'react'
import { apiService } from '@/services/api'
import {
  X,
  CalendarCheck,
  CircleNotch,
  Sparkle,
  CheckCircle,
  GraduationCap,
  Phone,
  EnvelopeSimple,
  User,
} from '@phosphor-icons/react'

interface DemoBookingModalProps {
  isOpen: boolean
  onClose: () => void
  initialCourse?: string
}

const COURSES = [
  'Full Stack Web Development',
  'Data Science & Machine Learning',
  'Cloud Computing with AWS',
  'UI/UX Design Masterclass',
  'DevOps & Kubernetes',
  'Cybersecurity & Ethical Hacking',
]

const TIME_SLOTS = [
  'Morning (10:00 AM - 12:00 PM)',
  'Afternoon (02:00 PM - 04:00 PM)',
  'Evening (06:00 PM - 08:00 PM)',
  'Weekend Batch Consultation',
]

export function DemoBookingModal({ isOpen, onClose, initialCourse }: DemoBookingModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [college, setCollege] = useState('')
  const [courseInterest, setCourseInterest] = useState(initialCourse || COURSES[0])
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[0])
  const [message, setMessage] = useState('')

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please provide your name, email, and 10-digit phone number.')
      return
    }

    setLoading(true)
    try {
      await apiService.submitDemoRequest({
        fullName,
        email,
        phone,
        college,
        courseInterest,
        preferredDate: preferredDate || undefined,
        preferredTime,
        message,
      })
      setSubmitted(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit demo request'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#101B3C] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
            aria-label="Close modal"
          >
            <X size={20} weight="bold" />
          </button>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkle size={14} weight="fill" />
            <span>Live Interactive Demo</span>
          </div>
          <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans']">
            Request a Free Live Demo
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Connect with an industry mentor to review curricula, project roadmaps, and career trajectories.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle size={36} weight="fill" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Demo Session Reserved!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto mb-6">
                Thank you, <strong>{fullName}</strong>! A career counselor will reach out via WhatsApp/Phone within 2 hours to confirm your session timing for <strong>{courseInterest}</strong>.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-[#155EEF] text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-400" size={15} />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 text-slate-400" size={15} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <EnvelopeSimple className="absolute left-3 top-2.5 text-slate-400" size={15} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College / Organization
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-2.5 text-slate-400" size={15} />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. BIT Bangalore"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Program of Interest
                </label>
                <select
                  value={courseInterest}
                  onChange={(e) => setCourseInterest(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                >
                  {COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Questions or Learning Goals (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Want to understand placement support for tier-3 college students..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#155EEF] hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                >
                  {loading ? (
                    <>
                      <CircleNotch className="animate-spin" size={14} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CalendarCheck size={14} weight="bold" />
                      <span>Confirm Free Demo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
