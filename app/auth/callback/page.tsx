'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const supabase = getSupabaseBrowser()

      // Perform PKCE/OAuth exchange if present; for magic links this is harmless.
      // Don't assign to a var to avoid ESLint "unused" warnings.
      await supabase.auth.exchangeCodeForSession(window.location.href).catch(() => {})

      // Clean up the URL hash if present
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }

      const { data } = await supabase.auth.getSession()
      router.replace(data.session ? '/dashboard' : '/login?error=Login%20link%20invalid%20or%20expired')
    }

    run()
  }, [router])

  return <main className="p-8">Signing you in…</main>
}
