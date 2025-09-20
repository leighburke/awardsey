import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Read-only Supabase client for Server Components.
 * Only exposes cookies.get so it NEVER tries to mutate cookies during render.
 */
export function createSupabaseServerReadOnly() {
  const store = cookies()
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value
      },
      // intentionally no set/remove here
    },
  })
}

/**
 * Read–write Supabase client for Server Actions / Route Handlers.
 * Safe to call cookies.set/remove in these contexts.
 */
export function createSupabaseServer() {
  const store = cookies()
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        store.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        store.set({ name, value: '', ...options, maxAge: 0 })
      },
    },
  })
}
