'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  PencilSimple,
  Eye,
  EyeSlash,
  WarningCircle,
  CheckCircle,
  Key,
  EnvelopeSimple,
  ArrowClockwise,
} from '@phosphor-icons/react'
import { useStudentAuth } from '@/context/StudentAuthContext'

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: { client_id: string; callback: (res: { credential?: string }) => void }) => void
          prompt: () => void
        }
        oauth2?: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (res: { access_token?: string; error?: string }) => void
            error_callback?: (err: { type: string; message?: string }) => void
          }) => {
            requestAccessToken: () => void
          }
        }
      }
    }
  }
}

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialEmail?: string
  initialMode?: 'step1' | 'otp' | 'signup' | 'login'
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
  const { login, checkEmail, sendOtp, verifyOtp, googleSso } = useStudentAuth()

  const [step, setStep] = useState<'step1' | 'otp' | 'signup' | 'login'>(initialMode)
  const [email, setEmail] = useState(initialEmail)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [previewCode, setPreviewCode] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [emailLoading, setEmailLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const isBusy = emailLoading || googleLoading || otpLoading || passwordLoading

  useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  if (!isOpen) return null

  const handleEditEmail = () => {
    setError('')
    setSuccessMsg('')
    setOtpCode('')
    setStep('step1')
  }

  // Step 1: User submits email -> Check if existing or new user
  const handleContinueWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    const cleanEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@example.com)')
      return
    }

    setEmailLoading(true)
    try {
      const result = await checkEmail(cleanEmail)
      if (result.exists) {
        // Returning student: Automatically send 6-digit login code to their email!
        try {
          const otpRes = await sendOtp(cleanEmail)
          if (otpRes?.previewCode) setPreviewCode(otpRes.previewCode)
          setSuccessMsg(`Welcome back! We sent a 6-digit login code to ${cleanEmail}`)
          setStep('otp')
          setResendTimer(30)
        } catch (otpErr: unknown) {
          setError(otpErr instanceof Error ? otpErr.message : 'Failed to send login code. Please try again.')
        }
      } else {
        // First-time student: ask name and then verify code
        setStep('signup')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not check email. Please check your connection and try again.')
    } finally {
      setEmailLoading(false)
    }
  }

  // First-time user requests OTP code
  const handleRequestSignupOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    if (!name.trim()) {
      setError('Please enter your full name')
      return
    }

    setOtpLoading(true)
    try {
      const otpRes = await sendOtp(email.trim().toLowerCase(), name.trim())
      if (otpRes?.previewCode) setPreviewCode(otpRes.previewCode)
      setSuccessMsg(`Verification code sent to ${email.trim()}`)
      setStep('otp')
      setResendTimer(30)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send code. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  // Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!otpCode || otpCode.trim().length < 6) {
      setError('Please enter the 6-digit verification code')
      return
    }

    setOtpLoading(true)
    try {
      await verifyOtp(email.trim().toLowerCase(), otpCode.trim(), name.trim())
      setSuccessMsg('Signed in successfully!')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 400)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid or expired code. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setError('')
    setOtpLoading(true)
    try {
      const otpRes = await sendOtp(email.trim().toLowerCase(), name.trim())
      if (otpRes?.previewCode) setPreviewCode(otpRes.previewCode)
      setSuccessMsg('A new verification code has been sent!')
      setResendTimer(30)
    } catch {
      setError('Could not resend code. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  // Optional traditional Password Login fallback
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!password) {
      setError('Please enter your password')
      return
    }

    setPasswordLoading(true)
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
      setPasswordLoading(false)
    }
  }

  // Google OAuth SSO Handler
  const handleGoogleLogin = () => {
    setError('')
    const rawClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
    const googleClientId = rawClientId.trim()

    if (!googleClientId || googleClientId.includes('your-google-client-id')) {
      setError(
        'Google OAuth Client ID is not configured yet. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in client/apps/website/.env.local.'
      )
      return
    }

    if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
      setError('Google Sign-In is initializing. Please wait a moment and try again.')
      return
    }

    try {
      setGoogleLoading(true)

      // Fallback timeout to unblock UI if popup is closed or blocked without event
      const timer = setTimeout(() => {
        setGoogleLoading(false)
      }, 45000)

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'email profile openid',
        error_callback: (err) => {
          clearTimeout(timer)
          setGoogleLoading(false)
          if (err && err.type !== 'popup_closed') {
            setError(`Google Sign-In cancelled or failed (${err.type || 'error'})`)
          }
        },
        callback: async (response) => {
          clearTimeout(timer)
          if (response.error || !response.access_token) {
            setGoogleLoading(false)
            if (response.error !== 'popup_closed_by_user') {
              setError(`Google Sign-In: ${response.error || 'Authentication cancelled'}`)
            }
            return
          }

          try {
            await googleSso({ accessToken: response.access_token })
            setSuccessMsg('Connected with Google!')
            setTimeout(() => {
              onSuccess?.()
              onClose()
            }, 400)
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Google authentication failed.')
          } finally {
            setGoogleLoading(false)
          }
        },
      })

      tokenClient.requestAccessToken()
    } catch (err: unknown) {
      setGoogleLoading(false)
      setError(err instanceof Error ? err.message : 'Failed to initiate Google sign-in.')
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 border border-slate-200"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X size={20} />
          </button>

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <WarningCircle size={16} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle size={16} className="shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              STEP 1: Enter Email (Works for first time and returning)
             ═════════════════════════════════════════════════════════════ */}
          {step === 'step1' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 tracking-tight">
                  Welcome to CareerCatch
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  {courseTitle
                    ? `Sign in to access ${courseTitle}`
                    : 'Access live cohort masterclasses, student dashboard, and verifiable certificates.'}
                </p>
              </div>

              <form onSubmit={handleContinueWithEmail} className="space-y-4">
                <div>
                  <label htmlFor="modal-email-step1" className="block text-xs font-bold text-slate-800 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-email-step1"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {emailLoading ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                  ) : (
                    <EnvelopeSimple size={18} weight="bold" />
                  )}
                  <span>{emailLoading ? 'Checking email...' : 'Continue with Email'}</span>
                </button>
              </form>

              {/* Or Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="relative px-3 bg-white text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    or
                  </span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isBusy}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin shrink-0" />
                  ) : (
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
                  )}
                  <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
                </button>
              </div>

              {/* Legal Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500 leading-normal">
                  By continuing, you accept CareerCatch&apos;s Terms of Service and Privacy Notice.
                </p>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              STEP: OTP Verification (For returning users & after signup)
             ═════════════════════════════════════════════════════════════ */}
          {step === 'otp' && (
            <div>
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 tracking-tight">
                  Check your email
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  We sent a 6-digit login verification code to your email.
                </p>
              </div>

              {/* Email chip with edit icon */}
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#EBF3FE] border border-blue-200 mb-4">
                <div className="flex items-center gap-2 truncate">
                  <EnvelopeSimple size={16} className="text-[#0056D2] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                    {email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleEditEmail}
                  className="p-1 rounded-md text-slate-600 hover:text-blue-700 hover:bg-blue-100/60 transition-colors cursor-pointer shrink-0"
                  title="Change email"
                >
                  <PencilSimple size={15} weight="bold" />
                </button>
              </div>

              {/* Instant Developer / Demo helper badge */}
              {previewCode && (
                <div className="mb-4 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
                  <span>Verification Code: <strong className="font-mono text-sm tracking-wider font-extrabold text-[#0056D2]">{previewCode}</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(previewCode)}
                    className="text-[11px] font-bold text-[#0056D2] hover:underline cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label htmlFor="otp-input" className="block text-xs font-bold text-slate-800 mb-1.5">
                    Enter 6-Digit Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-center font-mono font-black text-2xl tracking-[0.4em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20 transition-all bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isBusy || otpCode.length < 6}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {otpLoading ? 'Verifying...' : 'Verify & Log In'}
                </button>
              </form>

              {/* Resend and alternate login options */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isBusy}
                  className="inline-flex items-center gap-1 font-semibold text-[#0056D2] hover:underline disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ArrowClockwise size={13} className={resendTimer > 0 ? '' : 'text-[#0056D2]'} />
                  <span>{resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setStep('login')
                  }}
                  className="font-medium text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                >
                  Use password instead
                </button>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              STEP: First-time Sign Up (Enter name then verify OTP)
             ═════════════════════════════════════════════════════════════ */}
          {step === 'signup' && (
            <div>
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 tracking-tight">
                  First-Time Student Registration
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Enter your name to set up your student learning dashboard.
                </p>
              </div>

              {/* Email chip with edit */}
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#EBF3FE] border border-blue-200 mb-4">
                <span className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                  {email}
                </span>
                <button
                  type="button"
                  onClick={handleEditEmail}
                  className="p-1 rounded-md text-slate-600 hover:text-blue-700 hover:bg-blue-100/60 transition-colors cursor-pointer shrink-0"
                  title="Edit email address"
                >
                  <PencilSimple size={15} weight="bold" />
                </button>
              </div>

              <form onSubmit={handleRequestSignupOtp} className="space-y-4">
                <div>
                  <label htmlFor="modal-name" className="block text-xs font-bold text-slate-800 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
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

                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Key size={18} weight="bold" />
                  <span>{otpLoading ? 'Sending code...' : 'Send Verification Code'}</span>
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-slate-600">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setStep('login')
                  }}
                  className="font-bold text-[#0056D2] hover:underline cursor-pointer"
                >
                  Log in with password
                </button>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              STEP: Traditional Password Login (Optional Alternative)
             ═════════════════════════════════════════════════════════════ */}
          {step === 'login' && (
            <div>
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 tracking-tight">
                  Welcome back!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Sign in with your password or use email verification code.
                </p>
              </div>

              {/* Email chip with edit button */}
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#EBF3FE] border border-blue-200 mb-4">
                <span className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                  {email}
                </span>
                <button
                  type="button"
                  onClick={handleEditEmail}
                  className="p-1 rounded-md text-slate-600 hover:text-blue-700 hover:bg-blue-100/60 transition-colors cursor-pointer shrink-0"
                  title="Edit email address"
                >
                  <PencilSimple size={15} weight="bold" />
                </button>
              </div>

              <form onSubmit={handlePasswordLogin} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {passwordLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <button
                  type="button"
                  onClick={async () => {
                    setError('')
                    setOtpLoading(true)
                    try {
                      const otpRes = await sendOtp(email.trim().toLowerCase())
                      if (otpRes?.previewCode) setPreviewCode(otpRes.previewCode)
                      setSuccessMsg(`Login code sent to ${email}`)
                      setStep('otp')
                      setResendTimer(30)
                    } catch {
                      setError('Failed to send code.')
                    } finally {
                      setOtpLoading(false)
                    }
                  }}
                  className="font-bold text-[#0056D2] hover:underline cursor-pointer"
                >
                  Send login code to email
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setStep('signup')
                  }}
                  className="font-medium text-slate-500 hover:underline cursor-pointer"
                >
                  New user? Sign up
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
