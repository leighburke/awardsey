'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getSupabaseBrowser } from '../../../lib/supabase/client'

export default function LoginPage() {
  const supabase = getSupabaseBrowser()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    const errorFromUrl = searchParams.get('error')
    if (errorFromUrl) setErr(decodeURIComponent(errorFromUrl))
  }, [searchParams])

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setErr(null); setMsg(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) setErr(error.message)
    else setMsg('Check your email for the login link.')
  }

  const signInWithGithub = async () => {
    setErr(null); setMsg(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setErr(error.message)
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold">Sign in</h1>

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

      {msg && <p className="mt-4 text-sm text-green-600">{msg}</p>}
      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
    </main>
  )
}
