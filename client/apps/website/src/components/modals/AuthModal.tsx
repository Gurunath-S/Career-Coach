'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  PencilSimple,
  Eye,
  EyeSlash,
  WarningCircle,
  CheckCircle,
} from '@phosphor-icons/react'
import { useStudentAuth } from '@/context/StudentAuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialEmail?: string
  initialMode?: 'step1' | 'signup' | 'login'
  courseTitle?: string
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialEmail = '',
  initialMode = 'step1',
  courseTitle,
}: AuthModalProps) {
  const { login, register, checkEmail, googleSso } = useStudentAuth()

  const [step, setStep] = useState<'step1' | 'signup' | 'login'>(initialMode)
  const [email, setEmail] = useState(initialEmail)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!isOpen) return null

  // Reset or switch back to Step 1 (email input)
  const handleEditEmail = () => {
    setError('')
    setSuccessMsg('')
    setStep('step1')
  }

  // Step 1: User submits email -> Check if existing or new
  const handleContinueWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const result = await checkEmail(email)
      if (result.exists) {
        setStep('login')
      } else {
        setStep('signup')
      }
    } catch {
      // Default to signup if check fails
      setStep('signup')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 (New User): Sign up / Join for free
  const handleJoinForFree = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Please enter your full name')
      return
    }
    if (password.length < 8) {
      setError('Password must be between 8 and 72 characters')
      return
    }

    setLoading(true)
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      })
      setSuccessMsg('Account created successfully!')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 400)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 (Existing User): Log in
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!password) {
      setError('Please enter your password')
      return
    }

    setLoading(true)
    try {
      await login(email.trim().toLowerCase(), password)
      setSuccessMsg('Welcome back!')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 400)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  // Google SSO Handler
  const handleGoogleSso = async () => {
    setError('')
    setLoading(true)
    try {
      const defaultEmail = email && email.includes('@') ? email : 'student.learner@gmail.com'
      const defaultName = name || defaultEmail.split('@')[0]
      await googleSso(defaultEmail, defaultName)
      setSuccessMsg('Connected with Google!')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 400)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google SSO failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-['Inter']">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} weight="bold" />
          </button>

          {/* Optional Course Enrollment Context Notice */}
          {courseTitle && (
            <div className="mb-4 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700 flex items-center gap-1.5">
              <span>Enrolling in:</span>
              <strong className="truncate">{courseTitle}</strong>
            </div>
          )}

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <WarningCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
              <CheckCircle size={18} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              STEP 1: Log in or create account (Email + SSO)
             ═════════════════════════════════════════════════════════════ */}
          {step === 'step1' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 tracking-tight">
                  Log in or create account
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                  Learn on your own time from top engineering mentors and industry leaders.
                </p>
              </div>

              <form onSubmit={handleContinueWithEmail} className="space-y-4">
                <div>
                  <label htmlFor="modal-email" className="block text-xs font-bold text-slate-800 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    autoFocus
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {loading ? 'Continuing...' : 'Continue'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-3 bg-white text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  or
                </span>
              </div>

              {/* Social Login Options */}
              <div className="space-y-2.5">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleSso}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Facebook Button */}
                <button
                  type="button"
                  onClick={handleGoogleSso}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-[#1877F2] shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Continue with Facebook</span>
                </button>

                {/* Apple Button */}
                <button
                  type="button"
                  onClick={handleGoogleSso}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-slate-900 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.64-.78 1.08-1.86.96-2.95-1 .04-2.16.66-2.84 1.45-.6.69-1.12 1.8-1 2.87 1.12.09 2.24-.59 2.88-1.37z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>

              {/* Legal Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500 leading-normal">
                  I accept CareerCatch&apos;s{' '}
                  <a href="#terms" className="text-[#0056D2] underline">
                    Terms of Use
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" className="text-[#0056D2] underline">
                    Privacy Notice
                  </a>
                  .
                </p>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              STEP 2: Sign up (Coursera style with email chip + edit icon)
             ═════════════════════════════════════════════════════════════ */}
          {step === 'signup' && (
            <div>
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 tracking-tight">
                  Sign up
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Learn on your own time from top universities and businesses.
                </p>
              </div>

              <form onSubmit={handleJoinForFree} className="space-y-4">
                {/* Email with edit button (Exact image 1 style) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#EBF3FE] border border-blue-200">
                    <span className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                      {email}
                    </span>
                    <button
                      type="button"
                      onClick={handleEditEmail}
                      className="p-1 rounded-md text-slate-600 hover:text-blue-700 hover:bg-blue-100/60 transition-colors cursor-pointer shrink-0"
                      title="Edit email address"
                    >
                      <PencilSimple size={16} weight="bold" />
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="modal-name" className="block text-xs font-bold text-slate-800 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20 transition-all"
                  />
                </div>

                {/* Password with Eye toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="modal-password" className="block text-xs font-bold text-slate-800">
                      Password <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-1">Between 8 and 72 characters</p>
                  <div className="relative">
                    <input
                      id="modal-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      maxLength={72}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Join for Free Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {loading ? 'Creating account...' : 'Join for Free'}
                </button>
              </form>

              {/* Bottom footer link */}
              <div className="mt-5 text-center text-xs text-slate-600">
                Already on CareerCatch?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setStep('login')
                  }}
                  className="font-bold text-[#0056D2] hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              STEP 2 (Existing User): Log in
             ═════════════════════════════════════════════════════════════ */}
          {step === 'login' && (
            <div>
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 tracking-tight">
                  Welcome back!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Enter your password to sign in.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email with edit button */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#EBF3FE] border border-blue-200">
                    <span className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                      {email}
                    </span>
                    <button
                      type="button"
                      onClick={handleEditEmail}
                      className="p-1 rounded-md text-slate-600 hover:text-blue-700 hover:bg-blue-100/60 transition-colors cursor-pointer shrink-0"
                      title="Edit email address"
                    >
                      <PencilSimple size={16} weight="bold" />
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="modal-login-password" className="block text-xs font-bold text-slate-800">
                      Password <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="modal-login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoFocus
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Bottom footer link */}
              <div className="mt-5 text-center text-xs text-slate-600">
                New to CareerCatch?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setStep('signup')
                  }}
                  className="font-bold text-[#0056D2] hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
