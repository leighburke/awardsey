import { createSupabaseServer } from '@/lib/supabase/server'
import Link from 'next/link'
import { addChallenge } from './actions'

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

  const { data: challenges, error } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Welcome, {user.email}</h1>

<form action="/auth/signout" method="post" className="mt-2">
  <button
    type="submit"
    className="rounded border px-3 py-1 text-sm"
    title="Sign out"
  >
    Log out
  </button>
</form>

      <form action={addChallenge} className="flex items-center gap-2">
        <input
          name="title"
          placeholder="New challenge title"
          className="rounded border px-3 py-2 text-black"
          required
        />
        <select name="cadence" className="rounded border px-3 py-2 text-black">
          <option value="daily">daily</option>
          <option value="weekly">weekly</option>
          <option value="custom">custom</option>
        </select>
        <button className="rounded bg-black px-4 py-2 text-white" type="submit">
          Add
        </button>
      </form>

      {error && <p className="text-red-600">{error.message}</p>}

      <ul className="space-y-2">
        {(challenges ?? []).map((c) => (
          <li key={c.id} className="rounded border px-3 py-2">
            <div className="font-medium">{c.title}</div>
            <div className="text-sm text-gray-500">cadence: {c.cadence}</div>
          </li>
        ))}
      </ul>
    </main>
  )
}
