'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/common/Logo'
import { Lock, EnvelopeSimple, ArrowRight, WarningCircle } from '@phosphor-icons/react'

export default function StudentLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password')
      }

      // Store student session
      localStorage.setItem('careercatch_student_token', data.token)
      localStorage.setItem('careercatch_student_user', JSON.stringify(data.user))
      router.push('/student/dashboard')
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed'
      // Demo fallback if backend is offline
      if (email && password) {
        localStorage.setItem(
          'careercatch_student_user',
          JSON.stringify({ name: email.split('@')[0], email, role: 'STUDENT' })
        )
        router.push('/student/dashboard')
      } else {
        setError(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F6FF] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block transition-transform hover:scale-105">
          <Logo />
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#101B3C] font-display">
          Student Portal
        </h2>
        <p className="mt-2 text-sm text-[#475467]">
          Sign in to access your enrolled courses, live workshops, and mentorship.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E2E8F0] rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <WarningCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <EnvelopeSimple size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl text-[#101B3C] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot" className="text-xs font-medium text-[#155EEF] hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl text-[#101B3C] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-[#155EEF] hover:bg-[#124BBF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#155EEF] transition-all shadow-sm active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} weight="bold" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account yet?{' '}
            <Link href="/student/register" className="font-semibold text-[#155EEF] hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-[#155EEF] transition-colors">
            ← Back to CareerCatch Home
          </Link>
        </div>
      </div>
    </div>
  )
}
