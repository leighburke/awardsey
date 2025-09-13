// lib/supabase/server.ts
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
// Import the concrete type that cookies() resolves to
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

/**
 * Use this in Server Components, Route Handlers, and Server Actions.
 * It automatically reads/writes the auth session via cookies.
 */
export function createSupabaseServer() {
  // Some setups type cookies() as Promise<ReadonlyRequestCookies>.
  // We know it's sync in Server Components; cast it to the concrete type.
  const cookieStore = cookies() as unknown as ReadonlyRequestCookies

  return createServerClient(
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
}

