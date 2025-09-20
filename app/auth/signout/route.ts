// app/auth/signout/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Minimal type surface we need from Next's cookies store
type CookieStore = {
  get(name: string): { value: string } | undefined
  set(options: { name: string; value: string } & CookieOptions): void
}

export async function POST(request: Request) {
  // Works if cookies() returns a value or a Promise-like:
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
  return NextResponse.redirect(new URL('/login', request.url))
}

