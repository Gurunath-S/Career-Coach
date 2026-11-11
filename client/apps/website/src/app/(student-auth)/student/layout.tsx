import React from 'react'

export default function StudentAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="student-auth-container min-h-screen">{children}</div>
}
