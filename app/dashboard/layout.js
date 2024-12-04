'use client'

import ClientProtectedRoute from '../components/ClientProtectedRoute'

export default function DashboardLayout({ children }) {
  return (
    <main>
      <ClientProtectedRoute>
        {children}
      </ClientProtectedRoute>
    </main>
  )
} 