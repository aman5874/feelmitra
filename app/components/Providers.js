'use client'

import { SupabaseProvider } from '../supabase-provider'

export default function Providers({ children }) {
  return (
    <SupabaseProvider>
      {children}
    </SupabaseProvider>
  )
} 