import React, { useState, useEffect } from 'react'
import { adminApi } from '../../services/adminApi'
import { Event } from '@careercatch/shared-types'
import { EventFormModal } from './EventFormModal'
import {
  Plus,
  PencilSimple,
  Trash,
  CheckCircle,
  XCircle,
  CalendarBlank,
  Users,
  MapPin,
  MagnifyingGlass,
} from '@phosphor-icons/react'

export const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listEvents()
      setEvents(data)
    } catch {
      // offline fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleTogglePublish = async (event: Event) => {
    try {
      const updated = await adminApi.togglePublish(event.id, !event.isPublished)
      setEvents((prev) => prev.map((e) => (e.id === event.id ? updated : e)))
    } catch {
      // local toggle fallback
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, isPublished: !e.isPublished } : e))
      )
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      await adminApi.deleteEvent(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch {
      setEvents((prev) => prev.filter((e) => e.id !== id))
    }
  }

  const handleEdit = (event: Event) => {
    setSelectedEvent(event)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedEvent(null)
    setModalOpen(true)
  }

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.speakerName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-7xl font-inter">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101B3C] font-display">
            Events & Workshops
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, publish, and manage tech masterclasses and webinars.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#155EEF] hover:bg-[#124BBF] text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <Plus size={16} weight="bold" />
          <span>New Workshop / Event</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <MagnifyingGlass size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or speaker..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF]"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing {filteredEvents.length} events
        </div>
      </div>

      {/* Events Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No events found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        evt.isPublished
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {evt.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Speaker: <span className="text-[#101B3C]">{evt.speakerName} ({evt.speakerCompany})</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#101B3C] leading-snug">
                    {evt.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <CalendarBlank size={14} className="text-[#155EEF]" />
                      {new Date(evt.eventDate).toLocaleDateString()} • {evt.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-[#155EEF]" />
                      {evt.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-[#155EEF]" />
                      {evt.registeredCount} / {evt.capacity || 250} registered
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTogglePublish(evt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      evt.isPublished
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {evt.isPublished ? (
                      <>
                        <XCircle size={15} />
                        <span>Unpublish</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={15} />
                        <span>Publish</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleEdit(evt)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-[#155EEF] hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Edit Event"
                  >
                    <PencilSimple size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(evt.id)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Event"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <EventFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchEvents}
        initialEvent={selectedEvent}
      />
    </div>
  )
}
