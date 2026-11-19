import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#155EEF',
}

export const metadata: Metadata = {
  title: 'CareerCatch | Build Skills. Build Your Future.',
  description:
    'Industry-led tech programs with hands-on projects, real-world case studies, and mentorship from top engineers. Start your tech career with CareerCatch.',
  keywords: [
    'online coding bootcamp',
    'full stack development',
    'data science course',
    'UI/UX design',
    'career mentorship India',
    'tech placement support',
  ],
  authors: [{ name: 'CareerCatch' }],
  metadataBase: new URL('https://careercatch.in'),
  openGraph: {
    title: 'CareerCatch | Build Skills. Build Your Future.',
    description:
      'Industry-led tech programs with hands-on projects, real-world case studies, and mentorship from top engineers.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'CareerCatch',
    url: 'https://careercatch.in',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerCatch | Build Skills. Build Your Future.',
    description:
      'Industry-led tech programs with hands-on projects, real-world case studies, and mentorship from top engineers.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon.svg?v=2', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=2', sizes: 'any' },
    ],
    shortcut: '/favicon.ico?v=2',
    apple: '/apple-icon.png?v=2',
  },
}

import Script from 'next/script'
import { StudentAuthProvider } from '@/context/StudentAuthContext'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <head>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </head>
      <body
        className="min-h-screen bg-white text-[#101B3C] font-inter selection:bg-[#155EEF]/15 selection:text-[#101B3C]"
        suppressHydrationWarning
      >
        <StudentAuthProvider>{children}</StudentAuthProvider>
      </body>
    </html>
  )
}
