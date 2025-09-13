import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  // Supabase JS client handles session via cookies automatically on the client.
  // After redirect, just send the user somewhere in-app (dashboard/home).
  const url = new URL(req.url)
  const next = url.searchParams.get('next') || '/dashboard'
  return NextResponse.redirect(new URL(next, url.origin))
}

