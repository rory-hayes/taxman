import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/types/supabase'

export const createClient = () => {
  const supabase = createClientComponentClient<Database>({
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
      redirectTo: process.env.NEXT_PUBLIC_SUPABASE_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_SITE_URL}/auth/callback`
        : 'http://localhost:3000/auth/callback'
    }
  })
  return supabase
} 