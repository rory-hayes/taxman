'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Only create client if environment variables are available
  const supabase = typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
    createClient() : null

  useEffect(() => {
    if (!supabase) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase client not initialized')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUpWithEmail = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase client not initialized')
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        signInWithEmail,
        signUpWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 