import React from 'react'
import {
  CalendarBlank,
  ChartPieSlice,
  EnvelopeSimple,
  SignOut,
  ShieldCheck,
  User,
} from '@phosphor-icons/react'

interface AdminLayoutProps {
  currentTab: 'dashboard' | 'events' | 'enquiries'
  setCurrentTab: (tab: 'dashboard' | 'events' | 'enquiries') => void
  user: { name: string; email: string; role: string } | null
  onLogout: () => void
  children: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onLogout,
  children,
}) => {
  return (
    <div className="min-h-screen flex bg-[#F0F6FF]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#101B3C] text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          {/* Logo Brand Header */}
          <div className="h-18 flex items-center px-6 border-b border-white/10 gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#155EEF] flex items-center justify-center font-bold text-white text-lg font-display shadow-md">
              C
            </div>
            <div>
              <span className="font-display font-extrabold text-base tracking-tight block leading-none">
                Career<span className="text-[#FF9F1C]">Catch</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block mt-1">
                Admin Console
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-[#155EEF] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ChartPieSlice size={18} weight={currentTab === 'dashboard' ? 'fill' : 'regular'} />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setCurrentTab('events')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'events'
                  ? 'bg-[#155EEF] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <CalendarBlank size={18} weight={currentTab === 'events' ? 'fill' : 'regular'} />
              <span>Events & Workshops</span>
            </button>

            <button
              onClick={() => setCurrentTab('enquiries')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'enquiries'
                  ? 'bg-[#155EEF] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <EnvelopeSimple size={18} weight={currentTab === 'enquiries' ? 'fill' : 'regular'} />
              <span>Inquiries & Leads</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with user info & logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
              <User size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate text-white">{user?.name || 'Admin'}</p>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck size={12} weight="fill" /> {user?.role || 'SUPER_ADMIN'}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <SignOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">CareerCatch</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-bold text-[#101B3C] uppercase tracking-wider">
              {currentTab}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#155EEF] hover:underline flex items-center gap-1"
            >
              <span>View Public Website</span>
              <span>↗</span>
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
