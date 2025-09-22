'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = getSupabaseBrowser()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  // Read any error passed back from /auth/callback without useSearchParams
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)

    // query (?error=...&message=...)
    const qError = url.searchParams.get('error')
    const qMsg = url.searchParams.get('message')

    // hash (#error=...&error_description=...)
    const hash = window.location.hash || ''
    const hParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
    const hError = hParams.get('error')
    const hMsg = hParams.get('error_description')

    if (qError || hError) {
      setErr(qMsg || hMsg || qError || hError)
    }
  }, [])

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setErr(null); setMsg(null)
    const redirect = `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirect }
    })
    setLoading(false)
    if (error) setErr(error.message)
    else setMsg('Check your email for the login link.')
  }

  const signInWithGithub = async () => {
    setErr(null); setMsg(null)
    const redirect = `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: redirect }
    })
    if (error) setErr(error.message)
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold">Sign in</h1>

      {err && (
        <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">
          {err}
        </p>
      )}
      {msg && (
        <p className="mt-4 rounded bg-green-50 p-3 text-sm text-green-700">
          {msg}
        </p>
      )}

      <form onSubmit={sendMagicLink} className="mt-6 space-y-3">
        <input
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border px-4 py-3 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button disabled={loading} className="w-full rounded-xl bg-black px-4 py-3 text-white">
          {loading ? 'Sending…' : 'Send magic link'}
        </button>
      </form>

      <div className="mt-6">
        <button onClick={signInWithGithub} className="w-full rounded-xl border px-4 py-3">
          Continue with GitHub
        </button>
      </div>
    </main>
  )
}
