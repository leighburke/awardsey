import { createSupabaseServer } from '@/lib/supabase/server'
import Link from 'next/link'
import { addChallenge, markDoneToday } from './actions'
import { signOut } from '@/app/auth/signout/action'
import { computeCurrentStreak, isDoneToday } from '@/lib/utils/streaks'
import type { PostgrestError } from '@supabase/supabase-js'

type Challenge = {
  id: string
  title: string
  cadence: string
  created_at: string
}

type Entry = {
  challenge_id: string
  entry_date: string // YYYY-MM-DD
}

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
   
  const challengesRes = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false })

  const challenges = challengesRes.data as Challenge[] | null
  const error = challengesRes.error as PostgrestError | null

  // Fetch last 90 days of entries for this user
  const since = new Date()
  since.setDate(since.getDate() - 90)
  const sinceISO = since.toISOString().slice(0,10)

  const entriesRes = await supabase
    .from('challenge_entries')
    .select('challenge_id,entry_date')
    .gte('entry_date', sinceISO)

  const entries = entriesRes.data as Entry[] | null

  // Group entries by challenge
  const byChallenge = new Map<string, string[]>()
  entries?.forEach(e => {
    if (!byChallenge.has(e.challenge_id)) byChallenge.set(e.challenge_id, [])
    byChallenge.get(e.challenge_id)!.push(e.entry_date)
  })
    
  return (
    <main className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold">Welcome, {user.email}</h1>
        {/* logout via server action */}
        <form action={signOut}>
          <button
            type="submit"
            className="rounded border px-3 py-1 text-sm"
            title="Sign out"
          >
            Log out
          </button>
        </form>
      </div>

      {/* add challenge form */}
      <form action={addChallenge} className="flex flex-wrap items-center gap-2">
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
        {(challenges ?? []).map((c) => {
          const dates = byChallenge.get(c.id) ?? []
          const streak = computeCurrentStreak(dates)
          const done = isDoneToday(dates)

          return (
            <li key={c.id} className="rounded border p-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{c.title}</div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                    <span className="rounded-full border px-2 py-0.5">
                      cadence: {c.cadence}
                    </span>
                    <span className="rounded-full border px-2 py-0.5">
                      🔥 {streak} day{streak === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>

                <form action={markDoneToday} className="shrink-0">
                  <input type="hidden" name="challenge_id" value={c.id} />
                  <button
                    className={`rounded border px-2 py-1 text-sm ${done ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type="submit"
                    disabled={done}
                    title={done ? 'Already marked today' : 'Mark done today'}
                  >
                    {done ? 'Done today' : 'Mark done today'}
                  </button>
                </form>
              </div>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
