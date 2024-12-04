'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const SupabaseContext = createContext()

export function SupabaseProvider({ children }) {
  const [supabase] = useState(() => createClientComponentClient())

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {})
    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
} 