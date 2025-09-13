import { createSupabaseServer } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="p-8">
        <p>Please <Link className="underline" href="/login">log in</Link>.</p>
      </main>
    )
  }

  return (
    <main className="p-8 space-y-4">
      <p>Welcome, {user.email}</p>
      <form action="/auth/signout" method="post">
        <button className="rounded-lg border px-4 py-2" type="submit">Log out</button>
      </form>
    </main>
  )
}

