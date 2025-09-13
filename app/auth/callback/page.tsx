'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      // PKCE / OAuth code exchange (expects the full URL)
      const { error: _exchangeError } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      )
      // For magic links, tokens can arrive in the URL fragment. After the call above,
      // Supabase should establish the session and set cookies (client-side).
      // It's okay if exchangeError exists for magic-link flows; we check session next.

      // Optional: clear the hash to keep URLs tidy
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/dashboard')
      } else {
        router.replace('/login?error=Login%20link%20invalid%20or%20expired')
      }
    }
    run()
  }, [router])

  return (
    <main className="p-8">
      <p>Signing you in…</p>
    </main>
  )
}

