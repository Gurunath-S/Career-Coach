'use client'

import React, { useState, useEffect, type FormEvent } from 'react'
import Link from 'next/link'
import Logo from '@/components/common/Logo'
import { apiService } from '@/services/api'
import { useStudentAuth } from '@/context/StudentAuthContext'
import {
  ArrowLeft,
  User,
  Phone,
  EnvelopeSimple,
  GraduationCap,
  Check,
  CircleNotch,
  Briefcase,
} from '@phosphor-icons/react'

export default function StudentProfilePage() {
  const { user } = useStudentAuth()
  const [phone, setPhone] = useState('')
  const [college, setCollege] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [currentRole, setCurrentRole] = useState('')
  const [skills, setSkills] = useState('')
  const [bio, setBio] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        const profile = await apiService.getStudentProfile()
        if (profile) {
          setPhone(profile.phone || '')
          setCollege(profile.college || '')
          setGraduationYear(profile.graduationYear ? String(profile.graduationYear) : '')
          setCurrentRole(profile.currentRole || '')
          setSkills((profile.skills || []).join(', '))
          setBio(profile.bio || '')
        }
      } catch (err: unknown) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      await apiService.updateStudentProfile({
        phone,
        college,
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : undefined,
        currentRole,
        skills: skillsArray,
        bio,
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save profile'
      setError(msg)
    } finally {
      setSaving(false)
    }
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

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          {/* Card Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#101B3C] font-display">Student Profile Settings</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Keep your college details and technical skills up to date for mentor reviews and placements.
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 text-[#155EEF] font-bold text-lg flex items-center justify-center uppercase">
              {user?.name ? user.name[0] : 'S'}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <CircleNotch size={24} className="animate-spin mx-auto mb-2 text-blue-600" />
              Loading profile details...
            </div>
          ) : (
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {error && (
                <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              {/* Readonly Account Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-400" size={15} />
                    <input
                      type="text"
                      disabled
                      value={user?.name || ''}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <EnvelopeSimple className="absolute left-3 top-2.5 text-slate-400" size={15} />
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Editable Academic & Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-2.5 text-slate-400" size={15} />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. RV College of Engineering"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Role / Status</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 text-slate-400" size={15} />
                    <input
                      type="text"
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      placeholder="e.g. 3rd Year CSE / Fresher"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technical Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, Docker"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Career Goal</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share what tech roles you are targeting..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                {saved && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check size={16} weight="bold" /> Saved successfully
                  </span>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#155EEF] hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <CircleNotch size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Profile Changes</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
