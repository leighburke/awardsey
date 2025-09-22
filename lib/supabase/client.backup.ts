'use client'

import { createBrowserClient } from '@supabase/ssr'

// A single browser-side Supabase client (for use in client components like Login)
export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
