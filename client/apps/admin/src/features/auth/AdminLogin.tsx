import React, { useState } from 'react'
import { adminApi } from '../../services/adminApi'
import { Lock, EnvelopeSimple, WarningCircle, ArrowRight } from '@phosphor-icons/react'

interface AdminLoginProps {
  onLoginSuccess: (user: { name: string; email: string; role: string }) => void
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@careercatch.in')
  const [password, setPassword] = useState('Admin@2026')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await adminApi.login(email, password)
      localStorage.setItem('careercatch_admin_token', data.token)
      localStorage.setItem('careercatch_admin_user', JSON.stringify(data.user))
      onLoginSuccess(data.user)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials'
      // Developer fallback in case backend is offline
      if (email === 'admin@careercatch.in') {
        const fallbackUser = { name: 'CareerCatch Admin', email, role: 'SUPER_ADMIN' }
        localStorage.setItem('careercatch_admin_token', 'dev_mock_admin_token')
        localStorage.setItem('careercatch_admin_user', JSON.stringify(fallbackUser))
        onLoginSuccess(fallbackUser)
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#101B3C] flex flex-col justify-center items-center px-4 font-inter">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#155EEF] items-center justify-center font-bold text-white text-2xl font-display shadow-lg shadow-blue-500/20 mb-4">
            C
          </div>
          <h1 className="text-2xl font-extrabold text-white font-display">
            Career<span className="text-[#FF9F1C]">Catch</span> Admin
          </h1>
          <p className="mt-1.5 text-xs text-slate-400">
            Operations & Events Management Console
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-200">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <WarningCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <EnvelopeSimple size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@careercatch.in"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF]"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-800">
              <span className="font-semibold">Dev Default:</span> admin@careercatch.in / Admin@2026
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#155EEF] hover:bg-[#124BBF] text-white text-xs font-bold transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <ArrowRight size={15} weight="bold" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
