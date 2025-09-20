'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      await supabase.auth.exchangeCodeForSession(window.location.href).catch(() => {})
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
