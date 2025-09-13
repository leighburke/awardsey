import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase/server'

export default async function Header() {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="font-semibold">Awardsey</Link>
      <nav className="flex items-center gap-4">
        <Link href="/dashboard">Dashboard</Link>
        {user ? (
          <form action="/auth/signout" method="post">
            <button className="rounded-lg border px-3 py-1.5" type="submit">Log out</button>
          </form>
        ) : (
          <Link className="rounded-lg border px-3 py-1.5" href="/login">Log in</Link>
        )}
      </nav>
    </header>
  )
}

