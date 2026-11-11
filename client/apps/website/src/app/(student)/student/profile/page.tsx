'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/common/Logo'
import { ArrowLeft, User, Phone, EnvelopeSimple, GraduationCap, Check, Sparkle } from '@phosphor-icons/react'

export default function StudentProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Alex Hunter',
    email: 'alex@example.com',
    phone: '9876543210',
    college: 'Bangalore Institute of Technology',
    graduationYear: '2026',
    skills: 'React, TypeScript, Node.js, Python, PostgreSQL',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('careercatch_student_user')
    if (raw) {
      try {
        const u = JSON.parse(raw)
        setProfile((prev) => ({
          ...prev,
          name: u.name || prev.name,
          email: u.email || prev.email,
        }))
      } catch {
        // use default
      }
    }
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-[#155EEF] font-bold text-2xl flex items-center justify-center font-display">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#101B3C] font-display">Student Profile</h1>
              <p className="text-xs text-slate-500">Manage your educational background and technical interests.</p>
            </div>
          </div>

          {saved && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check size={16} weight="bold" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <EnvelopeSimple size={16} />
                  </div>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1">
                  Graduation Year
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap size={16} />
                  </div>
                  <input
                    type="text"
                    value={profile.graduationYear}
                    onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1">
                College / University
              </label>
              <input
                type="text"
                value={profile.college}
                onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1">
                Technical Skills & Interests (comma-separated)
              </label>
              <input
                type="text"
                value={profile.skills}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C]"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#155EEF] hover:bg-[#124BBF] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkle size={15} weight="fill" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
