'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/common/Logo'
import {
  EnvelopeSimple,
  PencilSimple,
  ArrowClockwise,
  Key,
  WarningCircle,
  CheckCircle,
} from '@phosphor-icons/react'
import { useStudentAuth } from '@/context/StudentAuthContext'

function StudentLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/student/dashboard'

  const { user, checkEmail, sendOtp, verifyOtp, googleSso } = useStudentAuth()

  const [step, setStep] = useState<'email' | 'otp' | 'signup'>('email')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [previewCode, setPreviewCode] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (user) {
      router.replace(redirectUrl)
    }
  }, [user, router, redirectUrl])

  useEffect(() => {
    if (resendTimer <= 0) return
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendTimer])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const result = await checkEmail(email)
      if (result.exists) {
        // Returning user: send OTP code immediately
        const otpRes = await sendOtp(email.trim().toLowerCase())
        if (otpRes?.previewCode) setPreviewCode(otpRes.previewCode)
        setSuccessMsg(`We sent a 6-digit login code to ${email}`)
        setStep('otp')
        setResendTimer(30)
      } else {
        // First-time student
        setStep('signup')
      }
    } catch {
      setStep('signup')
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Please enter your full name')
      return
    }

    setLoading(true)
    try {
      const otpRes = await sendOtp(email.trim().toLowerCase(), name.trim())
      if (otpRes?.previewCode) setPreviewCode(otpRes.previewCode)
      setSuccessMsg(`Verification code sent to ${email}`)
      setStep('otp')
      setResendTimer(30)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!otpCode || otpCode.trim().length < 6) {
      setError('Please enter the 6-digit code')
      return
    }

    setLoading(true)
    try {
      await verifyOtp(email.trim().toLowerCase(), otpCode.trim(), name.trim())
      setSuccessMsg('Logged in successfully!')
      router.push(redirectUrl)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid or expired code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    setError('')
    setLoading(true)
    try {
      const otpRes = await sendOtp(email.trim().toLowerCase(), name.trim())
      if (otpRes?.previewCode) setPreviewCode(otpRes.previewCode)
      setSuccessMsg('A new verification code has been sent!')
      setResendTimer(30)
    } catch {
      setError('Could not resend code.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setError('')
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!googleClientId || googleClientId.includes('your-google-client-id')) {
      setError('Google Sign-In is not configured on this environment.')
      return
    }

    if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
      setError('Google Sign-In is initializing. Please wait a moment and try again.')
      return
    }

    try {
      setLoading(true)
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'email profile openid',
        callback: async (response) => {
          if (response.error || !response.access_token) {
            setLoading(false)
            if (response.error !== 'popup_closed_by_user') {
              setError(`Google Sign-In: ${response.error || 'Authentication cancelled'}`)
            }
            return
          }
          try {
            await googleSso({ accessToken: response.access_token })
            setSuccessMsg('Connected with Google!')
            router.push(redirectUrl)
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Google authentication failed.')
          } finally {
            setLoading(false)
          }
        },
      })
      tokenClient.requestAccessToken()
    } catch (err: unknown) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Failed to initiate Google sign-in.')
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F6FF] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101B3C] font-display">
          Student Portal Log In
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600">
          Access your courses, upcoming masterclasses, and credentials.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200">
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

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Email Address
                </label>
                <input
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
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <EnvelopeSimple size={18} weight="bold" />
                <span>{loading ? 'Checking...' : 'Continue with Email'}</span>
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-semibold">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
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
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#EBF3FE] border border-blue-200">
                <span className="text-xs font-semibold text-slate-800 truncate">{email}</span>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="p-1 rounded text-blue-700 hover:bg-blue-100"
                >
                  <PencilSimple size={15} weight="bold" />
                </button>
              </div>

              {previewCode && (
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
                  <span>Code: <strong className="font-mono text-sm tracking-wider font-extrabold text-[#0056D2]">{previewCode}</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(previewCode)}
                    className="text-[11px] font-bold text-[#0056D2] hover:underline"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-center font-mono font-black text-2xl tracking-[0.4em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#0056D2] bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="w-full py-3 px-4 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm transition-all shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Verify & Log In'}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0056D2] hover:underline disabled:text-slate-400"
                >
                  <ArrowClockwise size={13} />
                  <span>{resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}</span>
                </button>
              </div>
            </form>
          )}

          {step === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#EBF3FE] border border-blue-200">
                <span className="text-xs font-semibold text-slate-800 truncate">{email}</span>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="p-1 rounded text-blue-700 hover:bg-blue-100"
                >
                  <PencilSimple size={15} weight="bold" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0056D2]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Key size={18} weight="bold" />
                <span>{loading ? 'Sending code...' : 'Send Verification Code'}</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1"
            >
              <span>← Back to CareerCatch Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StudentLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F0F6FF]" />}>
      <StudentLoginContent />
    </Suspense>
  )
}
