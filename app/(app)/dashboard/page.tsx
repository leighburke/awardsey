import { createSupabaseServer } from '@/lib/supabase/server'
import Link from 'next/link'
import { addChallenge, markDoneToday } from './actions'
import { signOut } from '@/app/auth/signout/action'

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
      
      {/* logout now uses server action */}
      <form action={signOut} className="mt-2">
        <button
          type="submit"
          className="rounded border px-3 py-1 text-sm"
          title="Sign out"
        >
          Log out
        </button>
      </form>

      {/* add challenge form */}
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
          <li key={c.id} className="rounded border px-3 py-2 space-y-2">
            <div className="font-medium">{c.title}</div>
            <div className="text-sm text-gray-500">cadence: {c.cadence}</div>

            {/* mark done today button */}
            <form action={markDoneToday} className="inline-block">
              <input type="hidden" name="challenge_id" value={c.id} />
              <button
                className="rounded border px-2 py-1 text-sm"
                type="submit"
              >
                Mark done today
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  )
}

