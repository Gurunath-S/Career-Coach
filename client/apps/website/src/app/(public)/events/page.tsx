import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingEnrollButton from '@/components/common/FloatingEnrollButton'
import Link from 'next/link'
import { CalendarBlank, Users, Clock, ArrowRight } from '@phosphor-icons/react/dist/ssr'

const PUBLIC_EVENTS = [
  {
    id: 'evt_1',
    title: 'System Design at Scale: Microservices with AWS',
    desc: 'Learn how to architect high-throughput distributed systems using AWS ECS, Redis caching, and Kafka streaming.',
    speaker: 'Sneha Patel',
    company: 'AWS Alumni',
    date: 'Nov 18, 2026',
    time: '6:00 PM IST',
    attendees: 184,
  },
  {
    id: 'evt_2',
    title: 'Cracking Modern Full-Stack Interviews in 2026',
    desc: 'A deep-dive into full-stack coding rounds, Next.js hydration challenges, SQL optimization, and live mock interview breakdowns.',
    speaker: 'Ravi Kumar',
    company: 'Google Alumni',
    date: 'Nov 22, 2026',
    time: '11:00 AM IST',
    attendees: 312,
  },
]

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F0F6FF] py-16 px-4 sm:px-6 lg:px-8 font-inter">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#155EEF]">
              Live Learning Events
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#101B3C] font-display mt-2">
              Tech Masterclasses & Workshops
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Interactive weekend cohorts taught by senior software architects and engineering leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {PUBLIC_EVENTS.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="px-2.5 py-1 rounded-md font-bold bg-blue-50 text-[#155EEF]">
                      Live Online
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} /> {evt.attendees} attending
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#101B3C]">{evt.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{evt.desc}</p>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                    <div>
                      Speaker: <span className="font-semibold text-slate-800">{evt.speaker} ({evt.company})</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <CalendarBlank size={14} className="text-[#155EEF]" /> {evt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-[#155EEF]" /> {evt.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href="/student/login"
                    className="w-full py-2.5 rounded-xl bg-[#155EEF] hover:bg-[#124BBF] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Reserve Free Seat</span>
                    <ArrowRight size={14} weight="bold" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingEnrollButton />
    </>
  )
}
