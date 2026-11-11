import React from 'react'

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="student-dashboard-wrapper min-h-screen">{children}</div>
}
