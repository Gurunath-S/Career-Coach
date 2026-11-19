'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  MagnifyingGlass,
  ArrowRight,
  ArrowLeft,
  Plus,
  Check,
  Stack,
  Hexagon,
  ChartLine,
  Lightning,
  Cloud,
  Gear,
  Palette,
  Student,
  GraduationCap,
  ArrowsLeftRight,
  Code,
  Laptop,
} from '@phosphor-icons/react'
import Logo from '@/components/common/Logo'
import { apiService } from '@/services/api'
import { useStudentAuth } from '@/context/StudentAuthContext'
import { COURSES } from '@/lib/constants'
import type { StudentProfile } from '@careercatch/shared-types'

// ─── Step 1: Roles Aligned Strictly With CareerCatch Courses ─────────────────
const ROLES_LIST = [
  {
    id: 'Full Stack Developer',
    title: 'Full Stack Developer',
    icon: Stack,
    bg: '#0056D2', // Coursera Blue
  },
  {
    id: 'Data Scientist',
    title: 'Data Scientist',
    icon: Lightning,
    bg: '#F59E0B', // Orange
  },
  {
    id: 'Data Analyst',
    title: 'Data Analyst',
    icon: ChartLine,
    bg: '#EAB308', // Amber/Yellow
  },
  {
    id: 'Machine Learning Engineer',
    title: 'Machine Learning Engineer',
    icon: Hexagon,
    bg: '#F59E0B', // Orange
  },
  {
    id: 'Cloud Engineer',
    title: 'Cloud Engineer',
    icon: Cloud,
    bg: '#0056D2', // Blue
  },
  {
    id: 'DevOps Engineer',
    title: 'DevOps Engineer',
    icon: Gear,
    bg: '#F59E0B', // Orange
  },
  {
    id: 'UI/UX Designer',
    title: 'UI/UX Designer',
    icon: Palette,
    bg: '#7C3AED', // Purple
  },
  {
    id: 'Frontend Developer',
    title: 'Frontend Developer',
    icon: Code,
    bg: '#0056D2', // Blue
  },
  {
    id: 'Backend Developer',
    title: 'Backend Developer',
    icon: Laptop,
    bg: '#0056D2', // Blue
  },
  {
    id: 'Student',
    title: 'Student',
    icon: Student,
    bg: '#0056D2', // Blue
  },
  {
    id: 'Fresher',
    title: 'Fresher',
    icon: GraduationCap,
    bg: '#059669', // Green
  },
  {
    id: 'Career Switcher from Non-Tech',
    title: 'Career Switcher from Non-Tech',
    icon: ArrowsLeftRight,
    bg: '#059669', // Green
  },
]

// ─── Step 2: Skills Aligned Strictly With CareerCatch Course Curriculum ──────
const CURATED_SKILLS = [
  'React & Next.js',
  'Node.js & Express',
  'Python Programming',
  'Machine Learning & AI',
  'SQL & PostgreSQL',
  'Deep Learning & Neural Networks',
  'Data Analysis & Tableau',
  'AWS Cloud (EC2, S3, Lambda)',
  'Docker & Containers',
  'Kubernetes & CI/CD',
  'Figma & UI/UX Design',
  'REST APIs & Microservices',
  'TypeScript',
  'Git & Version Control',
  'System Design & Architecture',
  "I don't know",
]

// ─── Step 3: Highest Level of Education (Exact Coursera Copy & Pill Shape) ───
const EDUCATION_OPTIONS = [
  'Less than high school diploma (or equivalent)',
  'High school diploma (or equivalent)',
  'Some college, but no degree',
  'Associate Degree (e.g., AA, AS)',
  "Bachelor's degree (e.g., BA, AB, BS)",
  "Master's degree (e.g., MA, MS, MEng, MEd, MSW, MBA)",
  'Professional school degree (e.g., MD, DDS, DVM, LLB, JD)',
  'Doctorate degree (e.g., PhD, EdD)',
]

export default function OnboardingScreen() {
  const router = useRouter()
  const { user } = useStudentAuth()

  // 3-step flow (Step 1 removed as requested)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [saving, setSaving] = useState(false)
  const [existingProfile, setExistingProfile] = useState<StudentProfile | null>(null)

  // Search queries for Step 1 & 2
  const [roleQuery, setRoleQuery] = useState('')
  const [skillQuery, setSkillQuery] = useState('')

  // User selections (all non-mandatory)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedEducation, setSelectedEducation] = useState<string>('')

  // Prepopulate if student profile already exists
  useEffect(() => {
    let active = true
    async function fetchProfile() {
      try {
        const p = await apiService.getStudentProfile().catch(() => null)
        if (active && p) {
          setExistingProfile(p)
          if (p.currentRole) {
            setSelectedRole(p.currentRole)
          }
          if (p.skills && p.skills.length > 0) {
            setSelectedSkills(p.skills)
          }
          if (p.education) {
            setSelectedEducation(p.education)
          }
        }
      } catch (err) {
        console.warn('Could not fetch existing profile', err)
      }
    }
    fetchProfile()
    return () => {
      active = false
    }
  }, [user])

  const markCompleted = () => {
    if (typeof window !== 'undefined') {
      if (user?.id) {
        localStorage.setItem(`careercatch_onboarding_completed_${user.id}`, 'true')
      }
      sessionStorage.removeItem('careercatch_show_onboarding')
    }
  }

  const handleExit = () => {
    markCompleted()
    router.push('/')
  }

  const handleToggleSkill = (skill: string) => {
    if (skill === "I don't know") {
      setSelectedSkills((prev) => (prev.includes("I don't know") ? [] : ["I don't know"]))
      return
    }
    setSelectedSkills((prev) => {
      const filtered = prev.filter((s) => s !== "I don't know")
      return filtered.includes(skill) ? filtered.filter((s) => s !== skill) : [...filtered, skill]
    })
  }

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleFinalize()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFinalize = async () => {
    setSaving(true)
    markCompleted()

    try {
      const cleanSkills = selectedSkills.filter((s) => s !== "I don't know")
      const payload: Partial<StudentProfile> = {
        currentRole: selectedRole || existingProfile?.currentRole || null,
        interestedCourse: selectedRole || existingProfile?.interestedCourse || null,
        desiredRoles: selectedRole ? [selectedRole] : existingProfile?.desiredRoles || [],
        skills: cleanSkills.length > 0 ? cleanSkills : existingProfile?.skills || [],
        education: selectedEducation || existingProfile?.education || null,
      }

      const hasAnyInput = Boolean(
        selectedRole || cleanSkills.length > 0 || selectedEducation
      )

      if (hasAnyInput) {
        await apiService.updateStudentProfile(payload)
      }
    } catch (err) {
      console.warn('Could not save onboarding profile:', err)
    } finally {
      setSaving(false)
      router.push('/')
    }
  }

  // Filter roles based on search
  const filteredRoles = useMemo(() => {
    if (!roleQuery.trim()) return ROLES_LIST
    return ROLES_LIST.filter((r) =>
      r.title.toLowerCase().includes(roleQuery.toLowerCase().trim())
    )
  }, [roleQuery])

  // Filter skills based on search
  const filteredSkills = useMemo(() => {
    if (!skillQuery.trim()) return CURATED_SKILLS
    return CURATED_SKILLS.filter((s) =>
      s.toLowerCase().includes(skillQuery.toLowerCase().trim())
    )
  }, [skillQuery])

  return (
    <div className="min-h-screen bg-white flex flex-col font-['Inter',sans-serif] text-slate-900">
      {/* ─── Coursera Top Bar ─────────────────────────────────────────────── */}
      <header className="w-full border-b border-slate-200 bg-white px-6 sm:px-12 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <Logo iconSize={32} />
        <button
          type="button"
          onClick={handleExit}
          className="text-[#0056D2] font-semibold text-sm hover:underline cursor-pointer"
        >
          Exit
        </button>
      </header>

      {/* ─── Main Content Container ───────────────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col justify-between">
        <div className="w-full">
          {/* ─── Step 1 of 3: Great! What is your current role? ─────────────── */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Step 1 of 3
                </h2>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Great! What is your current role?
                </h1>
              </div>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto w-full mb-8 relative">
                <MagnifyingGlass
                  size={18}
                  weight="bold"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={roleQuery}
                  onChange={(e) => setRoleQuery(e.target.value)}
                  placeholder="Find a role"
                  className="w-full pl-11 pr-4 py-2.5 rounded-md border border-slate-300 text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-all bg-white"
                />
              </div>

              {/* Roles Cards Grid (3 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-w-4xl mx-auto">
                {filteredRoles.map((role) => {
                  const isSelected = selectedRole === role.id
                  const Icon = role.icon
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(isSelected ? '' : role.id)}
                      className={`border rounded-xl p-3.5 sm:p-4 bg-white flex items-center justify-between gap-3 cursor-pointer transition-all text-left shadow-xs ${
                        isSelected
                          ? 'border-[#0056D2] ring-1 ring-[#0056D2]'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white"
                        style={{ backgroundColor: role.bg }}
                      >
                        <Icon size={20} weight="fill" />
                      </div>

                      <span className="text-xs sm:text-sm font-semibold text-slate-900 flex-1 leading-snug">
                        {role.title}
                      </span>

                      {isSelected ? (
                        <Check size={18} weight="bold" className="text-[#0056D2] shrink-0" />
                      ) : (
                        <Plus size={18} weight="bold" className="text-slate-400 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ─── Step 2 of 3: Select the skills you'd like to develop ───────── */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Step 2 of 3
                </h2>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Select the skills you&apos;d like to develop
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  These are recommended based on your role(s)
                </p>
              </div>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto w-full mb-8 relative">
                <MagnifyingGlass
                  size={18}
                  weight="bold"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                  placeholder="Find a skill"
                  className="w-full pl-11 pr-4 py-2.5 rounded-md border border-slate-300 text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-all bg-white"
                />
              </div>

              {/* Skills Cards Grid (3 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-w-4xl mx-auto">
                {filteredSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill)
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleToggleSkill(skill)}
                      className={`border rounded-xl p-4 bg-white flex items-center justify-between gap-3 cursor-pointer transition-all text-left shadow-xs ${
                        isSelected
                          ? 'border-[#0056D2] ring-1 ring-[#0056D2] bg-blue-50/20'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 flex-1 leading-snug">
                        {skill}
                      </span>

                      {isSelected ? (
                        <Check size={18} weight="bold" className="text-[#0056D2] shrink-0" />
                      ) : (
                        <Plus size={18} weight="bold" className="text-slate-400 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ─── Step 3 of 3: Got it! What's your highest level of education? ── */}
          {step === 3 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Step 3 of 3
                </h2>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Got it! What&apos;s your highest level of education?
                </h1>
              </div>

              {/* Vertical Stack of Pill Shaped Buttons */}
              <div className="max-w-xl mx-auto space-y-3 w-full">
                {EDUCATION_OPTIONS.map((edu) => {
                  const isSelected = selectedEducation === edu
                  return (
                    <button
                      key={edu}
                      type="button"
                      onClick={() => setSelectedEducation(isSelected ? '' : edu)}
                      className={`w-full py-3 px-6 rounded-full border text-xs sm:text-sm font-medium text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0056D2] ring-1 ring-[#0056D2] text-[#0056D2] font-semibold bg-white'
                          : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400'
                      }`}
                    >
                      {edu}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ─── Bottom Navigation Buttons ─────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-4 mt-12 mb-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 rounded-md border border-[#0056D2] text-[#0056D2] hover:bg-blue-50/60 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} weight="bold" />
              <span>Back</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="px-7 py-2 rounded-md bg-[#0056D2] hover:bg-[#00419e] text-white text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            <span>{step < 3 ? 'Next' : saving ? 'Saving...' : 'Finish'}</span>
            {step < 3 && <ArrowRight size={16} weight="bold" />}
          </button>
        </div>
      </main>
    </div>
  )
}
