'use server'

import { redirect } from 'next/navigation'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Minimal typing that works across Next 15 environments (sync/async cookies())
type CookieStore = {
  get(name: string): { value: string } | undefined
  set(options: { name: string; value: string } & CookieOptions): void
}

export async function signOut(): Promise<void> {
  // Works whether cookies() is sync or Promise-like
  const cookieStore = (await Promise.resolve(cookies() as unknown)) as CookieStore

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )

  await supabase.auth.signOut()
  redirect('/login')
}
