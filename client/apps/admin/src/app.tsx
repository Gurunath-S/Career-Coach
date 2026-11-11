import React, { useState, useEffect } from 'react'
import { AdminLogin } from './features/auth/AdminLogin'
import { AdminLayout } from './components/layout/AdminLayout'
import { DashboardOverview } from './features/dashboard/DashboardOverview'
import { EventsList } from './features/events/EventsList'
import { EnquiriesList } from './features/enquiries/EnquiriesList'

export function App() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'events' | 'enquiries'>('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('careercatch_admin_user')
    const token = localStorage.getItem('careercatch_admin_token')
    if (raw && token) {
      try {
        setUser(JSON.parse(raw))
      } catch {
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('careercatch_admin_token')
    localStorage.removeItem('careercatch_admin_user')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F6FF] flex items-center justify-center text-xs font-semibold text-slate-500">
        Loading Admin Operations Console...
      </div>
    )
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />
  }

  return (
    <AdminLayout
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      user={user}
      onLogout={handleLogout}
    >
      {currentTab === 'dashboard' && (
        <DashboardOverview
          onNavigateTab={setCurrentTab}
          onCreateEvent={() => setCurrentTab('events')}
        />
      )}
      {currentTab === 'events' && <EventsList />}
      {currentTab === 'enquiries' && <EnquiriesList />}
    </AdminLayout>
  )
}
