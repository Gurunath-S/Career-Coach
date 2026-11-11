import React, { useState, useEffect } from 'react'
import { adminApi } from '../../services/adminApi'
import { Enquiry, EnquiryStatus } from '@careercatch/shared-types'
import { EnvelopeSimple, Phone, CalendarBlank, Check, MagnifyingGlass } from '@phosphor-icons/react'

export const EnquiriesList: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notes, setNotes] = useState('')

  const fetchEnquiries = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listEnquiries()
      setEnquiries(data)
    } catch {
      // offline fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const handleStatusChange = async (id: number, newStatus: EnquiryStatus) => {
    try {
      await adminApi.updateEnquiryStatus(id, newStatus)
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)))
    } catch {
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)))
    }
  }

  const handleSaveNotes = async (id: number) => {
    try {
      await adminApi.updateEnquiryStatus(id, enquiries.find((e) => e.id === id)?.status || 'NEW', notes)
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, notes } : e)))
      setEditingId(null)
    } catch {
      setEditingId(null)
    }
  }

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      e.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statuses: EnquiryStatus[] = ['NEW', 'CONTACTED', 'INTERESTED', 'ENROLLED', 'FOLLOW_UP', 'NOT_INTERESTED']

  return (
    <div className="space-y-6 max-w-7xl font-inter">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#101B3C] font-display">
          Student Inquiries & Admissions Leads
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time inquiries captured from public course pages and counseling forms.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <MagnifyingGlass size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, phone, email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {['ALL', ...statuses].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#155EEF] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading leads...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No matching inquiries found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((enq) => (
              <div
                key={enq.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        enq.status === 'NEW'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : enq.status === 'ENROLLED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {enq.status}
                    </span>
                    <span className="text-xs font-bold text-[#101B3C]">{enq.fullName}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">{enq.course || 'Tech Counseling'}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <a href={`tel:${enq.phone}`} className="flex items-center gap-1 hover:text-[#155EEF]">
                      <Phone size={14} className="text-[#155EEF]" />
                      <span>{enq.phone}</span>
                    </a>
                    <a href={`mailto:${enq.email}`} className="flex items-center gap-1 hover:text-[#155EEF]">
                      <EnvelopeSimple size={14} className="text-[#155EEF]" />
                      <span>{enq.email}</span>
                    </a>
                    <span className="flex items-center gap-1">
                      <CalendarBlank size={14} className="text-[#155EEF]" />
                      <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  {enq.message && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-2xl">
                      &ldquo;{enq.message}&rdquo;
                    </p>
                  )}

                  {/* Notes / Counselor Remarks */}
                  {editingId === enq.id ? (
                    <div className="flex items-center gap-2 pt-1 max-w-xl">
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add counselor follow-up notes..."
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-[#101B3C]"
                      />
                      <button
                        onClick={() => handleSaveNotes(enq.id)}
                        className="px-3 py-1.5 bg-[#155EEF] text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={14} /> Save
                      </button>
                    </div>
                  ) : enq.notes ? (
                    <div
                      onClick={() => {
                        setEditingId(enq.id)
                        setNotes(enq.notes || '')
                      }}
                      className="text-[11px] text-slate-500 cursor-pointer hover:text-[#155EEF]"
                    >
                      <span className="font-semibold text-slate-700">Remarks:</span> {enq.notes} (Click to edit)
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(enq.id)
                        setNotes('')
                      }}
                      className="text-[11px] font-semibold text-[#155EEF] hover:underline cursor-pointer"
                    >
                      + Add follow-up remarks
                    </button>
                  )}
                </div>

                {/* Status Selector Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl text-[#101B3C] cursor-pointer focus:ring-2 focus:ring-[#155EEF]/20"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
