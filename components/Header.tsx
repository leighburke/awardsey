import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase/server'

export default async function Header() {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="font-semibold">Awardsey</Link>
      <nav className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/dashboard" className="underline">Dashboard</Link>
            <form action="/auth/signout" method="post">
              <button className="rounded border px-3 py-1" type="submit">Log out</button>
            </form>
          </>
        ) : (
          <Link href="/login" className="rounded border px-3 py-1">Log in</Link>
        )}
      </nav>
    </header>
  )
}
