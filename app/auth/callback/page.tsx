'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '../../lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const supabase = getSupabaseBrowser()

      // Safe for both OAuth and magic link
      await supabase.auth.exchangeCodeForSession(window.location.href).catch(() => {})

      // Tidy URL
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }

      const { data } = await supabase.auth.getSession()
      router.replace(data.session ? '/dashboard' : '/login?error=' + encodeURIComponent('Login link invalid or expired'))
    }
    run()
  }, [router])

  return <main className="p-8">Signing you in…</main>
}

