'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      // Try PKCE/code exchange if present (works for OAuth; safe to call)
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession()
      if (exchangeError) {
        // For magic links, Supabase returns tokens in hash; just try to read session next
        // console.warn('exchangeCodeForSession:', exchangeError.message)
      }

      // Ensure session is established and cookies are set
      const { data: { session }, error } = await supabase.auth.getSession()

      if (session && !error) {
        router.replace('/dashboard')
      } else {
        // If the email link was stale/used, Supabase will surface an error via hash
        // Send them back to login with a friendly message
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

