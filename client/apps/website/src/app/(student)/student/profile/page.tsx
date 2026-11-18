'use client'

import React, { useState, useEffect, useRef, type FormEvent } from 'react'
import Link from 'next/link'
import Logo from '@/components/common/Logo'
import { apiService } from '@/services/api'
import { useStudentAuth } from '@/context/StudentAuthContext'
import {
  ArrowLeft,
  User as UserIcon,
  Phone,
  EnvelopeSimple,
  GraduationCap,
  Check,
  CircleNotch,
  Briefcase,
  MagnifyingGlass,
  Plus,
  X,
  CaretDown,
  Camera,
  Sparkle,
  BookOpen,
  Trash,
} from '@phosphor-icons/react'

// Options for Personalization Settings (Matching User Design)

const EDUCATION_OPTIONS = [
  "Bachelor's Degree (B.Tech / B.E / BCA / B.Sc)",
  "Master's Degree (M.Tech / MCA / M.Sc / MBA)",
  'Diploma / Polytechnic',
  'High School / Secondary Education (10+2)',
  'Doctorate / Ph.D',
  'Bootcamp Graduate / Self-Taught',
]

const INTERESTED_COURSE_OPTIONS = [
  'Full Stack Web Development (React, Next.js & Node)',
  'Data Science & Machine Learning (Python, AI & SQL)',
  'Cloud Computing & DevOps (AWS, Docker & Kubernetes)',
  'UI/UX Design & Digital Product Systems (Figma)',
  'Mobile App Development (React Native & Flutter)',
  'Programming for Everybody (Python Core & Backend)',
  'Advanced System Design & Distributed Architectures',
]

const POPULAR_SKILL_OPTIONS = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'PostgreSQL',
  'Docker',
  'AWS',
  'Tailwind CSS',
  'Figma',
  'Kubernetes',
  'GraphQL',
  'MongoDB',
  'Git & GitHub',
  'System Design',
  'Machine Learning',
  'FastAPI',
  'Go',
  'Java',
  'Linux',
  'CI/CD',
  'REST APIs',
]

const POPULAR_ROLE_OPTIONS = [
  'Student',
  'Full Stack Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'AI / ML Engineer',
  'UI/UX Designer',
  'Mobile App Developer',
  'Software Development Engineer (SDE)',
  'Cloud Solutions Architect',
  'Fresher / Looking for 1st Job',
]

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
]

export default function StudentProfilePage() {
  const { user, refreshUser } = useStudentAuth()

  // Basic Account Details
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const [college, setCollege] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [bio, setBio] = useState('')

  // Personalization Settings (From screenshot design)
  const [learningGoal, setLearningGoal] = useState('')
  const [desiredRoles, setDesiredRoles] = useState<string[]>([])
  const [roleInput, setRoleInput] = useState('')
  const [desiredSkills, setDesiredSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [currentRole, setCurrentRole] = useState('Student')
  const [education, setEducation] = useState('')
  const [interestedCourse, setInterestedCourse] = useState('')

  // Dropdown & Search UI State
  const [skillSuggestionsOpen, setSkillSuggestionsOpen] = useState(false)
  const [roleSuggestionsOpen, setRoleSuggestionsOpen] = useState(false)

  const skillInputRef = useRef<HTMLInputElement>(null)
  const roleInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Status State
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
          setName(profile.user?.name || user?.name || '')
          setAvatar(profile.user?.avatar || user?.avatar || null)
          setPhone(profile.phone || '')
          setCollege(profile.college || '')
          setGraduationYear(profile.graduationYear ? String(profile.graduationYear) : '')
          setCurrentRole(profile.currentRole || 'Student')
          setBio(profile.bio || '')
          setEducation(profile.education || '')
          setLearningGoal(profile.learningGoal || '')
          setInterestedCourse(profile.interestedCourse || '')
          setDesiredRoles(profile.desiredRoles || [])
          setDesiredSkills(profile.skills || [])
        }
      } catch (err: unknown) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [user])

  // Handlers for Desired Roles
  const handleAddRole = (roleToAdd: string) => {
    const trimmed = roleToAdd.trim()
    if (!trimmed) return
    if (!desiredRoles.includes(trimmed)) {
      setDesiredRoles([...desiredRoles, trimmed])
    }
    setRoleInput('')
    setRoleSuggestionsOpen(false)
  }

  const handleRemoveRole = (roleToRemove: string) => {
    setDesiredRoles(desiredRoles.filter((r) => r !== roleToRemove))
  }

  // Handlers for Desired Skills
  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim()
    if (!trimmed) return
    if (!desiredSkills.includes(trimmed)) {
      setDesiredSkills([...desiredSkills, trimmed])
    }
    setSkillInput('')
    setSkillSuggestionsOpen(false)
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setDesiredSkills(desiredSkills.filter((s) => s !== skillToRemove))
  }

  // Avatar Upload Handler
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Profile image must be less than 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setAvatar(base64)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  // Save Complete Profile
  const handleSave = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    setError('')

    try {
      await apiService.updateStudentProfile({
        name: name.trim() || undefined,
        avatar: avatar ?? null,
        phone,
        education,
        college,
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : undefined,
        currentRole,
        learningGoal,
        desiredRoles,
        interestedCourse,
        skills: desiredSkills,
        bio,
      } as any)

      await refreshUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save profile'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  // Filter suggestion list based on input
  const filteredRoles = POPULAR_ROLE_OPTIONS.filter(
    (r) =>
      r.toLowerCase().includes(roleInput.toLowerCase()) &&
      !desiredRoles.includes(r)
  )

  const filteredSkills = POPULAR_SKILL_OPTIONS.filter(
    (s) =>
      s.toLowerCase().includes(skillInput.toLowerCase()) &&
      !desiredSkills.includes(s)
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] pb-20">
      {/* ─── Top Bar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft size={15} weight="bold" />
              <span>Back to My learning</span>
            </Link>
            <div className="hidden sm:block">
              <Logo />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-fade-in">
                <Check size={14} weight="bold" />
                <span>Changes Saved</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#0056D2] hover:bg-[#00419e] rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <CircleNotch size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Free Layout Content ───────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Page Title & Intro */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight">
            Profile &amp; Career Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Customize your learning goals, target roles, technical skills, and academic profile. We tailor your cohort recommendations and mentor reviews around these inputs.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-800 cursor-pointer">
              <X size={16} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center text-slate-400 text-sm">
            <CircleNotch size={28} className="animate-spin mx-auto mb-3 text-blue-600" />
            <span>Loading profile details...</span>
          </div>
        ) : (
          <div className="space-y-12">
            {/* ─── SECTION 1: FREE PROFILE & AVATAR LAYOUT ──────────────────── */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 mb-8 border-b border-slate-100 gap-6">
                {/* Profile Photo Area */}
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-white font-extrabold text-3xl font-['Plus_Jakarta_Sans'] shrink-0">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={name || user?.name || 'Profile'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{(name || user?.name || 'S').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 text-white border-2 border-white flex items-center justify-center shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
                      title="Upload new photo"
                    >
                      <Camera size={15} weight="bold" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                      Profile Photo
                    </h2>
                    <p className="text-xs text-slate-500">
                      JPG, PNG or GIF up to 2MB. Visible to mentors and cohort peers.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Upload Photo
                      </button>
                      {avatar && (
                        <button
                          type="button"
                          onClick={() => setAvatar(null)}
                          className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Trash size={13} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preset Avatars */}
                <div className="flex flex-col items-start sm:items-end gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Or choose an avatar
                  </span>
                  <div className="flex items-center gap-2">
                    {AVATAR_PRESETS.map((pUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatar(pUrl)}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 ${
                          avatar === pUrl
                            ? 'border-blue-600 ring-2 ring-blue-500/30'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img src={pUrl} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Free 2-Column Academic & Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <EnvelopeSimple size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">College / University</label>
                  <div className="relative">
                    <GraduationCap size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. RV College of Engineering"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Graduation Year</label>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Bio / Career Objective</label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="e.g. Passionate learner targeting Full Stack Developer roles"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* ─── SECTION 2: PERSONALIZATION SETTINGS (MATCHING USER SCREENSHOT) ─── */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs">
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight">
                  Personalization settings
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Configure your career goals, target roles, preferred skills, and enrolled course tracks.
                </p>
              </div>

              <div className="space-y-8">
                {/* 2. Interested Course / Program */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-8 border-b border-slate-200/80">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-bold text-slate-800">Interested course</label>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Your primary area of technical specialization
                    </span>
                  </div>
                  <div className="md:col-span-7">
                    <div className="relative">
                      <select
                        value={interestedCourse}
                        onChange={(e) => setInterestedCourse(e.target.value)}
                        className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-500/20 transition-all pr-10 cursor-pointer"
                      >
                        <option value="">Select an option</option>
                        {INTERESTED_COURSE_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <CaretDown
                        size={16}
                        weight="bold"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Desired Roles */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pb-8 border-b border-slate-200/80">
                  <div className="md:col-span-5 pt-2">
                    <label className="block text-sm font-bold text-slate-800">Desired roles</label>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Job titles and roles you want to qualify for
                    </span>
                  </div>
                  <div className="md:col-span-7 space-y-3">
                    {/* Input with Search icon & '+' button (matching screenshot) */}
                    <div className="relative flex items-center">
                      <div className="relative flex-1">
                        <MagnifyingGlass
                          size={18}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                        />
                        <input
                          ref={roleInputRef}
                          type="text"
                          value={roleInput}
                          onFocus={() => setRoleSuggestionsOpen(true)}
                          onChange={(e) => {
                            setRoleInput(e.target.value)
                            setRoleSuggestionsOpen(true)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddRole(roleInput)
                            }
                          }}
                          placeholder="Add a role"
                          className="w-full pl-10 pr-14 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddRole(roleInput)}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-200/80 hover:bg-blue-600 hover:text-white text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                          title="Add role"
                        >
                          <Plus size={16} weight="bold" />
                        </button>
                      </div>

                      {/* Dropdown Suggestions */}
                      {roleSuggestionsOpen && filteredRoles.length > 0 && (
                        <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white rounded-xl border border-slate-200 shadow-xl z-20 max-h-48 overflow-y-auto p-1.5 text-xs">
                          {filteredRoles.slice(0, 6).map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => handleAddRole(role)}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 font-semibold transition-colors flex items-center justify-between"
                            >
                              <span>{role}</span>
                              <Plus size={13} weight="bold" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Selected Role Tags */}
                    {desiredRoles.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {desiredRoles.map((role) => (
                          <span
                            key={role}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold"
                          >
                            <span>{role}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRole(role)}
                              className="p-0.5 rounded-full hover:bg-blue-200 text-blue-600 cursor-pointer transition-colors"
                            >
                              <X size={12} weight="bold" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Desired Skills / Technical Skills (Dropdown + Tag Add) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pb-8 border-b border-slate-200/80">
                  <div className="md:col-span-5 pt-2">
                    <label className="block text-sm font-bold text-slate-800">Desired skills</label>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Languages, frameworks, tools &amp; libraries to master
                    </span>
                  </div>
                  <div className="md:col-span-7 space-y-3">
                    {/* Input with Search icon & '+' button (matching screenshot) */}
                    <div className="relative flex items-center">
                      <div className="relative flex-1">
                        <MagnifyingGlass
                          size={18}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                        />
                        <input
                          ref={skillInputRef}
                          type="text"
                          value={skillInput}
                          onFocus={() => setSkillSuggestionsOpen(true)}
                          onChange={(e) => {
                            setSkillInput(e.target.value)
                            setSkillSuggestionsOpen(true)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddSkill(skillInput)
                            }
                          }}
                          placeholder="Add a skill"
                          className="w-full pl-10 pr-14 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSkill(skillInput)}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-200/80 hover:bg-blue-600 hover:text-white text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                          title="Add skill"
                        >
                          <Plus size={16} weight="bold" />
                        </button>
                      </div>

                      {/* Dropdown Suggestions */}
                      {skillSuggestionsOpen && filteredSkills.length > 0 && (
                        <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white rounded-xl border border-slate-200 shadow-xl z-20 max-h-52 overflow-y-auto p-1.5 text-xs">
                          {filteredSkills.slice(0, 8).map((skill) => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => handleAddSkill(skill)}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 font-semibold transition-colors flex items-center justify-between"
                            >
                              <span>{skill}</span>
                              <Plus size={13} weight="bold" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Suggestions Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-semibold mr-1">Popular:</span>
                      {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'Figma']
                        .filter((s) => !desiredSkills.includes(s))
                        .slice(0, 5)
                        .map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleAddSkill(s)}
                            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            + {s}
                          </button>
                        ))}
                    </div>

                    {/* Selected Skill Tags */}
                    {desiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {desiredSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="p-0.5 rounded-full hover:bg-slate-300 text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
                            >
                              <X size={12} weight="bold" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Current Role (with Search Icon & Clear Button) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-8 border-b border-slate-200/80">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-bold text-slate-800">Current role</label>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Your present employment or academic standing
                    </span>
                  </div>
                  <div className="md:col-span-7">
                    <div className="relative">
                      <MagnifyingGlass
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                      />
                      <input
                        type="text"
                        value={currentRole}
                        onChange={(e) => setCurrentRole(e.target.value)}
                        placeholder="e.g. Student"
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      {currentRole && (
                        <button
                          type="button"
                          onClick={() => setCurrentRole('')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                          title="Clear current role"
                        >
                          <X size={16} weight="bold" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 6. Highest Level of Education */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-bold text-slate-800">
                      Highest level of education
                    </label>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Completed or ongoing degree level
                    </span>
                  </div>
                  <div className="md:col-span-7">
                    <div className="relative">
                      <select
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-500/20 transition-all pr-10 cursor-pointer"
                      >
                        <option value="">Select an option</option>
                        {EDUCATION_OPTIONS.map((edu) => (
                          <option key={edu} value={edu}>
                            {edu}
                          </option>
                        ))}
                      </select>
                      <CaretDown
                        size={16}
                        weight="bold"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom Floating Save Button Bar */}
            <div className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500">
                All changes reflect across your cohort reviews, mentor matching, and dashboard.
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0056D2] hover:bg-[#00419e] rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <CircleNotch size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save All Changes</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
