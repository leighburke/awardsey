import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Read-only client for Server Components (no cookie mutations)
export function createSupabaseServerReadOnly() {
  return createServerClient(url, anon, {
    cookies: {
      get: async (name: string) => (await cookies()).get(name)?.value,
    },
  })
}

// Full server client for Server Actions / Route Handlers (can set/remove)
export function createSupabaseServer() {
  return createServerClient(url, anon, {
    cookies: {
      get: async (name: string) => (await cookies()).get(name)?.value,
      set: async (name: string, value: string, options: CookieOptions) => {
        ;(await cookies()).set({ name, value, ...options })
      },
      remove: async (name: string, options: CookieOptions) => {
        ;(await cookies()).set({ name, value: '', ...options, maxAge: 0 })
      },
    },
  })
}
