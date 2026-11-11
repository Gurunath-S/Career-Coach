import React, { useState, useEffect } from 'react'
import { adminApi } from '../../services/adminApi'
import { Event } from '@careercatch/shared-types'
import { X, UploadSimple, WarningCircle, CheckCircle, Sparkle } from '@phosphor-icons/react'

interface EventFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialEvent?: Event | null
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialEvent,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    categoryId: 'cat_cloud',
    speakerName: '',
    speakerRole: '',
    speakerCompany: '',
    speakerAvatar: '',
    bannerUrl: '',
    eventDate: '',
    duration: '90 Minutes',
    location: 'Online (Zoom Room)',
    capacity: 250,
    isPublished: true,
    tags: 'AWS, Cloud, Architecture',
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialEvent) {
      setFormData({
        title: initialEvent.title || '',
        slug: initialEvent.slug || '',
        description: initialEvent.description || '',
        categoryId: initialEvent.categoryId || 'cat_cloud',
        speakerName: initialEvent.speakerName || '',
        speakerRole: initialEvent.speakerRole || '',
        speakerCompany: initialEvent.speakerCompany || '',
        speakerAvatar: initialEvent.speakerAvatar || '',
        bannerUrl: initialEvent.bannerUrl || '',
        eventDate: initialEvent.eventDate ? new Date(initialEvent.eventDate).toISOString().slice(0, 16) : '',
        duration: initialEvent.duration || '90 Minutes',
        location: initialEvent.location || 'Online',
        capacity: initialEvent.capacity || 250,
        isPublished: initialEvent.isPublished ?? true,
        tags: initialEvent.tags ? initialEvent.tags.join(', ') : '',
      })
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        categoryId: 'cat_cloud',
        speakerName: '',
        speakerRole: '',
        speakerCompany: '',
        speakerAvatar: '',
        bannerUrl: '',
        eventDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
        duration: '90 Minutes',
        location: 'Online (Zoom Room)',
        capacity: 250,
        isPublished: true,
        tags: 'System Design, React, Node',
      })
    }
  }, [initialEvent, isOpen])

  if (!isOpen) return null

  // Handle auto-slug creation
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || !initialEvent ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
    }))
  }

  // Handle S3 Presigned Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError('')

    try {
      // 1. Get presigned upload URL from backend
      const presigned = await adminApi.getPresignedUploadUrl(file.name, file.type, 'events')

      // 2. Upload file directly to S3 (or dev upload simulation)
      await adminApi.uploadFile(presigned.uploadUrl, file)

      // 3. Store uploaded file URL in form state
      setFormData((prev) => ({ ...prev, bannerUrl: presigned.fileUrl }))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Image upload failed'
      setError(msg)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload: Partial<Event> = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        categoryId: formData.categoryId,
        speakerName: formData.speakerName,
        speakerRole: formData.speakerRole,
        speakerCompany: formData.speakerCompany,
        speakerAvatar: formData.speakerAvatar || undefined,
        bannerUrl: formData.bannerUrl || undefined,
        eventDate: new Date(formData.eventDate).toISOString(),
        duration: formData.duration,
        location: formData.location,
        capacity: Number(formData.capacity) || 250,
        isPublished: Boolean(formData.isPublished),
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }

      if (initialEvent?.id) {
        await adminApi.updateEvent(initialEvent.id, payload)
      } else {
        await adminApi.createEvent(payload)
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save event'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-inter">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#101B3C] font-display">
              {initialEvent ? 'Edit Workshop / Event' : 'Create New Event'}
            </h2>
            <p className="text-xs text-slate-500">Configure event details, speaker, and S3 banner image.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <WarningCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. System Design at Scale"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C] focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="system-design-at-scale"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What students will learn in this session..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C]"
            />
          </div>

          {/* Speaker Details */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-[#101B3C] uppercase tracking-wider">
              Speaker / Faculty Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Speaker Name *</label>
                <input
                  type="text"
                  required
                  value={formData.speakerName}
                  onChange={(e) => setFormData({ ...formData, speakerName: e.target.value })}
                  placeholder="e.g. Sneha Patel"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-[#101B3C]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Speaker Role *</label>
                <input
                  type="text"
                  required
                  value={formData.speakerRole}
                  onChange={(e) => setFormData({ ...formData, speakerRole: e.target.value })}
                  placeholder="e.g. Staff Architect"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-[#101B3C]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company *</label>
                <input
                  type="text"
                  required
                  value={formData.speakerCompany}
                  onChange={(e) => setFormData({ ...formData, speakerCompany: e.target.value })}
                  placeholder="e.g. AWS"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-[#101B3C]"
                />
              </div>
            </div>
          </div>

          {/* S3 Presigned Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1">
              Event Banner Image (AWS S3 Upload)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-4 py-2 rounded-xl border border-slate-300 hover:border-[#155EEF] bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors">
                <UploadSimple size={16} />
                <span>{uploadingImage ? 'Uploading via S3...' : 'Choose Image File'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                />
              </label>

              {formData.bannerUrl && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 truncate">
                  <CheckCircle size={16} weight="fill" />
                  <span className="truncate max-w-xs">{formData.bannerUrl}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1">
                Duration *
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 2 Hours"
                className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#101B3C] uppercase tracking-wider mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Online (Zoom)"
                className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-[#101B3C]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#101B3C]">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 rounded text-[#155EEF] focus:ring-[#155EEF]"
              />
              <span>Publish immediately on public website</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="px-5 py-2 rounded-xl bg-[#155EEF] hover:bg-[#124BBF] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Sparkle size={15} weight="fill" />
              <span>{loading ? 'Saving...' : initialEvent ? 'Update Event' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
