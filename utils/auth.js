import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const getCurrentUser = async () => {
  const supabase = createClientComponentClient()
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error:', error)
    return null
  }
} 