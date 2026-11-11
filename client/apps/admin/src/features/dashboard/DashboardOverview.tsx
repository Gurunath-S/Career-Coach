import React, { useEffect, useState } from 'react'
import { adminApi } from '../../services/adminApi'
import { Event, Enquiry } from '@careercatch/shared-types'
import {
  CalendarBlank,
  Users,
  EnvelopeSimple,
  Sparkle,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
} from '@phosphor-icons/react'

interface DashboardOverviewProps {
  onNavigateTab: (tab: 'events' | 'enquiries') => void
  onCreateEvent: () => void
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTab,
  onCreateEvent,
}) => {
  const [events, setEvents] = useState<Event[]>([])
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [evts, enqs] = await Promise.all([adminApi.listEvents(), adminApi.listEnquiries()])
        setEvents(evts)
        setEnquiries(enqs)
      } catch {
        // Handled silently
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const publishedCount = events.filter((e) => e.isPublished).length
  const totalRegistrations = events.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0)
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'NEW').length

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Welcome & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101B3C] font-display">
            Operations & Performance Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time workshop participation metrics and student admissions leads.
          </p>
        </div>

        <button
          onClick={onCreateEvent}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#155EEF] hover:bg-[#124BBF] text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <Plus size={16} weight="bold" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Active Events</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#155EEF] flex items-center justify-center">
              <CalendarBlank size={18} weight="bold" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#101B3C] font-display">
            {publishedCount}{' '}
            <span className="text-xs font-medium text-slate-400">/ {events.length}</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
            Published on public site
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Registrations</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users size={18} weight="bold" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#101B3C] font-display">
            {totalRegistrations}
          </div>
          <span className="text-[11px] font-semibold text-purple-600 mt-1 block">
            Across all cohorts
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">New Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <EnvelopeSimple size={18} weight="bold" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#101B3C] font-display">
            {newEnquiriesCount}
          </div>
          <span className="text-[11px] font-semibold text-amber-600 mt-1 block">
            Pending counselor callback
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">System Status</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={18} weight="fill" />
            </div>
          </div>
          <div className="text-lg font-bold text-emerald-700 font-display mt-1">
            Operational
          </div>
          <span className="text-[11px] font-medium text-slate-400 mt-1 block">
            Next.js + Express + PostgreSQL
          </span>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-bold text-[#101B3C] font-display uppercase tracking-wider">
                Recent Events & Workshops
              </h2>
              <button
                onClick={() => onNavigateTab('events')}
                className="text-xs font-semibold text-[#155EEF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Manage all</span>
                <ArrowRight size={13} weight="bold" />
              </button>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No events created yet.</p>
            ) : (
              <div className="space-y-3">
                {events.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors bg-slate-50/50 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            evt.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {evt.isPublished ? 'LIVE' : 'DRAFT'}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate">
                          {evt.speakerName} ({evt.speakerCompany})
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#101B3C] truncate">{evt.title}</h4>
                    </div>
                    <span className="text-xs font-bold text-[#155EEF] shrink-0">
                      {evt.registeredCount} attendees
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={onCreateEvent}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-[#155EEF] text-xs font-semibold text-slate-600 hover:text-[#155EEF] transition-colors cursor-pointer text-center"
            >
              + Add another workshop
            </button>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-bold text-[#101B3C] font-display uppercase tracking-wider">
                Recent Inquiries & Leads
              </h2>
              <button
                onClick={() => onNavigateTab('enquiries')}
                className="text-xs font-semibold text-[#155EEF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all leads</span>
                <ArrowRight size={13} weight="bold" />
              </button>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading inquiries...</p>
            ) : enquiries.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No leads recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {enquiries.slice(0, 3).map((enq) => (
                  <div
                    key={enq.id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors bg-slate-50/50 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            enq.status === 'NEW'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {enq.status}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate">{enq.phone}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#101B3C] truncate">{enq.fullName}</h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {enq.course || 'General Tech Counseling'}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                      <Clock size={12} /> Just now
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Leads are synchronized in real-time from the website contact forms.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
