import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Minimal shapes we actually use:
type CookieReader = {
  get(name: string): { name: string; value: string } | undefined
}
type CookieWriter = {
  set(input: { name: string; value: string } & CookieOptions): void
}

function isPromise<T>(v: unknown): v is Promise<T> {
  return typeof (v as { then?: unknown }).then === 'function'
}

/** Read cookie value in both RSC (sync) and action/route (promise-typed) contexts */
function readCookie(name: string): string | undefined {
  const storeUnknown = cookies() as unknown
  if (isPromise<CookieReader>(storeUnknown)) {
    // In some typings this appears as a Promise; we cannot synchronously read it here.
    return undefined
  }
  const store = storeUnknown as CookieReader
  return store.get(name)?.value
}

/** Get a writer that exposes .set() even when types mark cookies() as Promise */
function getCookieWriter(): CookieWriter {
  const storeUnknown = cookies() as unknown
  if (isPromise<unknown>(storeUnknown)) {
    // At runtime Next provides a writer with .set(); types can mis-declare it.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error: Next types mark cookies() as Promise in some contexts
    return storeUnknown as CookieWriter
  }
  return storeUnknown as CookieWriter
}

/**
 * Read-only Supabase client for Server Components.
 * Only exposes cookies.get so it NEVER tries to mutate cookies during render.
 */
export function createSupabaseServerReadOnly() {
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return readCookie(name)
      },
      // no set/remove here on purpose
    },
  })
}

/**
 * Read–write Supabase client for Server Actions / Route Handlers.
 * Safe to call cookies.set/remove in these contexts.
 */
export function createSupabaseServer() {
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return readCookie(name)
      },
      set(name: string, value: string, options: CookieOptions) {
        const writer = getCookieWriter()
        writer.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        const writer = getCookieWriter()
        writer.set({ name, value: '', ...options, maxAge: 0 })
      },
    },
  })
}
