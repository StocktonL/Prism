import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Session, User } from '@supabase/supabase-js'

interface AuthContext {
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthCtx = createContext<AuthContext>({
  session: null, user: null, loading: true, signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // HIPAA requirement: 30-minute inactivity timeout
  useEffect(() => {
    const TIMEOUT_MS = 1800000 // 30 minutes
    let timeoutId: ReturnType<typeof setTimeout>

    function resetTimer() {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        supabase.auth.signOut()
      }, TIMEOUT_MS)
    }

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'] as const

    events.forEach(event => window.addEventListener(event, resetTimer))
    resetTimer() // start the timer on mount

    return () => {
      clearTimeout(timeoutId)
      events.forEach(event => window.removeEventListener(event, resetTimer))
    }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthCtx.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  return useContext(AuthCtx)
}
