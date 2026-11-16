"use client"

import Link from 'next/link'
import { LinkedinLogo, TwitterLogo, InstagramLogo, YoutubeLogo } from '@phosphor-icons/react'
import Logo from '../common/Logo'

const FOOTER_COLS = [
  {
    title: 'Programs',
    links: [
      { label: 'Full Stack Development', href: '/courses?category=Full+Stack' },
      { label: 'Data Science & AI', href: '/courses?category=Data+Science' },
      { label: 'UI/UX Design', href: '/courses?category=UI%2FUX+Design' },
      { label: 'Cloud Computing & AWS', href: '/courses?category=Cloud' },
      { label: 'Mobile Development', href: '/courses?category=Mobile' },
      { label: 'Explore All Programs', href: '/courses' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About CareerCatch', href: '/about' },
      { label: 'Hands-on Projects', href: '/projects' },
      { label: 'Workshops & Events', href: '/events' },
      { label: 'Contact Advisors', href: '/contact' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'hello@careercatch.in', href: 'mailto:hello@careercatch.in' },
      { label: '+91 98765 43210', href: 'tel:+919876543210' },
      { label: 'Bengaluru, India', href: '/contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-16 font-['Inter']">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="mb-3">
              <Logo iconSize={32} />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-sm">
              Careers Crafted. Skills Proven. Industry-led tech programs with live weekend classes, capstone codebases, and direct senior engineer mentorship.
            </p>
            <div className="flex gap-2.5">
              {[
                { Icon: LinkedinLogo, href: 'https://linkedin.com' },
                { Icon: TwitterLogo, href: 'https://twitter.com' },
                { Icon: InstagramLogo, href: 'https://instagram.com' },
                { Icon: YoutubeLogo, href: 'https://youtube.com' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-slate-300 bg-white flex items-center justify-center text-slate-500 hover:text-[#0056D2] hover:border-blue-300 transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-600 hover:text-[#0056D2] transition-colors leading-snug block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerCatch Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link href="/courses" className="hover:text-slate-900 transition-colors">
              Programs
            </Link>
            <Link href="/contact" className="hover:text-slate-900 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
