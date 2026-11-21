'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkle,
  Code,
  Cpu,
  Palette,
  DeviceMobile,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  RocketLaunch,
  Student,
  Laptop,
  ArrowsLeftRight,
  MagnifyingGlass,
  Compass,
  Books,
  Certificate,
  Scroll,
  Buildings,
  Lightbulb,
} from '@phosphor-icons/react'
import { apiService } from '@/services/api'
import type { StudentProfile } from '@careercatch/shared-types'

// ─── Step 1: Predefined Career Domains ───────────────────────────────────────
const CAREER_DOMAINS = [
  {
    id: 'Full Stack Web Development',
    title: 'Full Stack Web Development',
    desc: 'React, Next.js, Node.js, PostgreSQL, System Design',
    icon: Code,
    color: '#0056D2',
    bg: '#EFF6FF',
  },
  {
    id: 'Data Science & AI',
    title: 'Data Science & AI',
    desc: 'Python, Machine Learning, Predictive Models, SQL',
    icon: Cpu,
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    id: 'Cloud & DevOps Engineering',
    title: 'Cloud & DevOps Engineering',
    desc: 'AWS, Docker, Kubernetes, CI/CD, Infrastructure',
    icon: RocketLaunch,
    color: '#0284C7',
    bg: '#F0F9FF',
  },
  {
    id: 'UI/UX Product Design',
    title: 'UI/UX Product Design',
    desc: 'Figma, Design Systems, User Research, Prototyping',
    icon: Palette,
    color: '#EC4899',
    bg: '#FDF2F8',
  },
  {
    id: 'Mobile App Development',
    title: 'Mobile App Development',
    desc: 'Flutter, React Native, Cross-Platform Architecture',
    icon: DeviceMobile,
    color: '#EA580C',
    bg: '#FFF7ED',
  },
  {
    id: 'Cybersecurity & Systems',
    title: 'Cybersecurity & Systems',
    desc: 'Network Defense, Ethical Hacking, App Security',
    icon: ShieldCheck,
    color: '#059669',
    bg: '#ECFDF5',
  },
]

// ─── Step 2: In-Demand Technologies & Skills ─────────────────────────────────
const POPULAR_SKILLS = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Machine Learning',
  'Tailwind CSS',
  'Figma',
  'System Design',
  'Kubernetes',
  'GraphQL',
  'MongoDB',
  'SQL',
  'Data Analytics',
  'Flutter',
  'Go / Golang',
]

// ─── Step 3: Conversational Current Role Options ─────────────────────────────
const CURRENT_ROLES = [
  {
    id: 'Student / College Fresher',
    title: 'College Student or Recent Graduate',
    desc: 'Currently studying in college or fresh out of school preparing for first tech job',
    icon: Student,
    color: '#0056D2',
    bg: '#EFF6FF',
  },
  {
    id: 'Working in Tech',
    title: 'Working Professional in Tech',
    desc: 'Software engineer, developer, QA, or analyst looking to level up skills',
    icon: Briefcase,
    color: '#0284C7',
    bg: '#F0F9FF',
  },
  {
    id: 'Career Switcher / Non-Tech',
    title: 'Career Switcher from Non-Tech',
    desc: 'Working in sales, operations, finance, or business aiming to break into tech',
    icon: ArrowsLeftRight,
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    id: 'Freelancer / Independent Builder',
    title: 'Freelancer or Self-Employed',
    desc: 'Building client products, indie projects, or expanding your freelance stack',
    icon: Laptop,
    color: '#EA580C',
    bg: '#FFF7ED',
  },
  {
    id: 'Job Seeker / Career Break',
    title: 'Job Seeker on a Career Break',
    desc: 'Actively preparing for technical interviews and looking for new opportunities',
    icon: MagnifyingGlass,
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    id: 'Curious Explorer',
    title: 'Exploring & Learning for Fun',
    desc: 'Just exploring courses, building personal side projects, and staying curious',
    icon: Compass,
    color: '#EC4899',
    bg: '#FDF2F8',
  },
]

// ─── Step 4: Conversational Education Options ────────────────────────────────
const EDUCATION_LEVELS = [
  {
    id: "Currently Pursuing Bachelor's Degree",
    title: "Pursuing Bachelor's Degree",
    desc: 'B.Tech, B.E, B.Sc, BCA, or equivalent undergraduate degree in progress',
    icon: Student,
    color: '#0056D2',
    bg: '#EFF6FF',
  },
  {
    id: "Bachelor's Degree (Completed)",
    title: "Bachelor's Degree (Graduated)",
    desc: 'Completed 3 or 4-year college degree program',
    icon: GraduationCap,
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    id: "Master's Degree or Higher",
    title: "Master's Degree or Higher",
    desc: 'M.Tech, MBA, MCA, M.Sc, PhD or postgraduate qualifications',
    icon: Books,
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    id: 'Diploma / Vocational Certification',
    title: 'Diploma / Polytechnic',
    desc: 'Specialized 2-3 year technical diploma or vocational certification',
    icon: Scroll,
    color: '#0284C7',
    bg: '#F0F9FF',
  },
  {
    id: 'High School / 12th Grade',
    title: 'High School / Secondary',
    desc: 'Completed or currently in 12th grade / pre-university',
    icon: Buildings,
    color: '#EA580C',
    bg: '#FFF7ED',
  },
  {
    id: 'Self-Taught / Alternative',
    title: 'Self-Taught / Alternative Pathway',
    desc: 'Learning independently, bootcamp graduate, or alternative background',
    icon: Lightbulb,
    color: '#EC4899',
    bg: '#FDF2F8',
  },
]

interface StudentOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
  currentProfile?: StudentProfile | null
  onSaved?: (updatedProfile: StudentProfile) => void
}

export function StudentOnboardingModal({
  isOpen,
  onClose,
  userId,
  currentProfile,
  onSaved,
}: StudentOnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [saving, setSaving] = useState(false)

  // User Selections (all completely optional)
  const [selectedGoal, setSelectedGoal] = useState<string>(
    currentProfile?.interestedCourse || currentProfile?.desiredRoles?.[0] || ''
  )
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentProfile?.skills || []
  )
  const [selectedRole, setSelectedRole] = useState<string>(
    currentProfile?.currentRole || ''
  )
  const [selectedEducation, setSelectedEducation] = useState<string>(
    currentProfile?.education || ''
  )

  if (!isOpen) return null

  const markCompleted = () => {
    if (typeof window !== 'undefined' && userId) {
      localStorage.setItem(`careercatch_onboarding_completed_${userId}`, 'true')
      sessionStorage.removeItem('careercatch_show_onboarding')
    }
  }

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4)
    } else {
      handleFinalize(false)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)
    }
  }

  const handleSkipAll = () => {
    markCompleted()
    onClose()
  }

  const handleFinalize = async (isSkippingCurrent = false) => {
    setSaving(true)
    markCompleted()

    try {
      const goalVal = selectedGoal ? selectedGoal.trim() : null
      const roleVal = selectedRole ? selectedRole.trim() : null

      // Build profile update payload
      const payload: Partial<StudentProfile> = {
        interestedCourse: goalVal,
        desiredRoles: goalVal ? [goalVal] : [],
        skills: selectedSkills,
        currentRole: roleVal,
        education: selectedEducation ? selectedEducation.trim() : null,
      }

      if (!isSkippingCurrent) {
        const updated = await apiService.updateStudentProfile(payload)
        onSaved?.(updated)
      } else if (currentProfile) {
        onSaved?.(currentProfile)
      }
    } catch (err) {
      console.warn('Could not save onboarding profile preferences:', err)
    } finally {
      setSaving(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* ─── Conversational Modal Header with Step 0X of 4 ─────────────── */}
        <div className="bg-[#101B3C] text-white p-5 sm:p-6 relative shrink-0">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0056D2] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                Personalized Learning Advisor • Step {step} of 4
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSkipAll}
                className="text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={handleSkipAll}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight">
              {step === 1 && 'Hey! What would you love to learn?'}
              {step === 2 && 'Awesome! What specific skills do you want to develop?'}
              {step === 3 && 'Nice! What is your current role right now?'}
              {step === 4 && "Got it! What's your highest level of education?"}
            </h2>
            <p className="text-xs text-blue-100/90 leading-relaxed">
              {step === 1 &&
                'Choose a target role or specialization to customize course recommendations (Not mandatory).'}
              {step === 2 &&
                'Pick any tools and tech stack you want to master. We will highlight the programs covering them.'}
              {step === 3 &&
                "Tell us a bit about where you are starting from so we can suggest courses that fit your stage."}
              {step === 4 &&
                'This helps us suggest the best learning path and career guidance tailored to your journey.'}
            </p>
          </div>

          {/* Stepper Progress Bar (4 steps) */}
          <div className="mt-5 grid grid-cols-4 gap-2 items-center">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-[#0056D2]' : 'bg-white/20'
                  }`}
                />
                <span className="text-[10px] font-bold text-slate-400 block">
                  Step 0{s}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Modal Scrollable Body ───────────────────────────────────────── */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {/* STEP 1: CAREER DOMAIN / TARGET ROLE */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Select your preferred track (or click Next to skip):</span>
                {selectedGoal && (
                  <button
                    type="button"
                    onClick={() => setSelectedGoal('')}
                    className="text-[#0056D2] font-semibold hover:underline cursor-pointer"
                  >
                    Clear selection
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAREER_DOMAINS.map((domain) => {
                  const isSelected = selectedGoal === domain.id
                  const Icon = domain.icon
                  return (
                    <button
                      key={domain.id}
                      type="button"
                      onClick={() => setSelectedGoal(domain.id)}
                      className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 group relative ${
                        isSelected
                          ? 'border-[#0056D2] bg-blue-50/70 shadow-xs'
                          : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: domain.bg, color: domain.color }}
                      >
                        <Icon size={22} weight="duotone" />
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <h4
                          className={`text-xs sm:text-sm font-bold leading-snug truncate ${
                            isSelected ? 'text-[#0056D2]' : 'text-slate-900'
                          }`}
                        >
                          {domain.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                          {domain.desc}
                        </p>
                      </div>

                      {/* Selected Checkmark Indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 absolute top-3.5 right-3.5 ${
                          isSelected
                            ? 'bg-[#0056D2] border-[#0056D2] text-white'
                            : 'border-slate-300 bg-white text-transparent'
                        }`}
                      >
                        <Check size={11} weight="bold" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 2: IN-DEMAND SKILLS SELECTION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Pick technologies you want to learn (or skip):</span>
                {selectedSkills.length > 0 && (
                  <span className="font-bold text-[#0056D2]">
                    {selectedSkills.length} selected
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {POPULAR_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill)
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleToggleSkill(skill)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-[#0056D2] text-white border-[#0056D2] shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <span>{skill}</span>
                      {isSelected && <Check size={13} weight="bold" />}
                    </button>
                  )
                })}
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-slate-600 flex items-start gap-2.5 mt-4">
                <Sparkle size={18} weight="fill" className="text-[#0056D2] shrink-0 mt-0.5" />
                <p>
                  You don&apos;t have to select every skill now. Courses that cover your chosen technologies will be prioritized at the top of your feed.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: CURRENT ROLE */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Choose the option that describes you best right now (or skip):</span>
                {selectedRole && (
                  <button
                    type="button"
                    onClick={() => setSelectedRole('')}
                    className="text-[#0056D2] font-semibold hover:underline cursor-pointer"
                  >
                    Clear selection
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CURRENT_ROLES.map((role) => {
                  const isSelected = selectedRole === role.id
                  const Icon = role.icon
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 group relative ${
                        isSelected
                          ? 'border-[#0056D2] bg-blue-50/70 shadow-xs'
                          : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: role.bg, color: role.color }}
                      >
                        <Icon size={22} weight="duotone" />
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <h4
                          className={`text-xs sm:text-sm font-bold leading-snug truncate ${
                            isSelected ? 'text-[#0056D2]' : 'text-slate-900'
                          }`}
                        >
                          {role.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                          {role.desc}
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 absolute top-3.5 right-3.5 ${
                          isSelected
                            ? 'bg-[#0056D2] border-[#0056D2] text-white'
                            : 'border-slate-300 bg-white text-transparent'
                        }`}
                      >
                        <Check size={11} weight="bold" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 4: HIGHEST LEVEL OF EDUCATION */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Select your education level (or click Finish to skip):</span>
                {selectedEducation && (
                  <button
                    type="button"
                    onClick={() => setSelectedEducation('')}
                    className="text-[#0056D2] font-semibold hover:underline cursor-pointer"
                  >
                    Clear selection
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EDUCATION_LEVELS.map((edu) => {
                  const isSelected = selectedEducation === edu.id
                  const Icon = edu.icon
                  return (
                    <button
                      key={edu.id}
                      type="button"
                      onClick={() => setSelectedEducation(edu.id)}
                      className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 group relative ${
                        isSelected
                          ? 'border-[#0056D2] bg-blue-50/70 shadow-xs'
                          : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: edu.bg, color: edu.color }}
                      >
                        <Icon size={22} weight="duotone" />
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <h4
                          className={`text-xs sm:text-sm font-bold leading-snug truncate ${
                            isSelected ? 'text-[#0056D2]' : 'text-slate-900'
                          }`}
                        >
                          {edu.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                          {edu.desc}
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 absolute top-3.5 right-3.5 ${
                          isSelected
                            ? 'bg-[#0056D2] border-[#0056D2] text-white'
                            : 'border-slate-300 bg-white text-transparent'
                        }`}
                      >
                        <Check size={11} weight="bold" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ─── Modal Footer with Next / Skip Actions ───────────────────────── */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/70 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft size={14} weight="bold" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSkipAll}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Skip all
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{step < 4 ? 'Next Step' : saving ? 'Saving...' : 'Finish & View Courses'}</span>
              <ArrowRight size={14} weight="bold" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
