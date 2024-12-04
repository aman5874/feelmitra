'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          window.location.href = '/auth'
          return
        }
        
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth error:', error)
        window.location.href = '/auth'
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        window.location.href = '/auth'
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F3] flex items-center justify-center">
        <div className="text-orange-600">Loading...</div>
      </div>
    )
  }

  return isAuthenticated ? children : null
} 