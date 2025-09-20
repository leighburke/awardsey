import { joinWaitlist } from './actions/waitlist'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="px-6 py-16">
      <section className="mx-auto max-w-3xl text-center space-y-4">
        <h1 className="text-4xl font-semibold">Build streaks. Earn awards.</h1>
        <p className="text-gray-600">Awardsey helps you stay consistent and celebrate progress.</p>

        <form action={joinWaitlist} className="mx-auto mt-6 flex max-w-md gap-2">
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded border px-4 py-3 text-black"
          />
          <input type="hidden" name="source" value="home_hero" />
          <button className="rounded bg-black px-4 py-3 text-white" type="submit">Join waitlist</button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Link className="underline" href="/login">Log in</Link>
          <Link className="underline" href="/dashboard">Dashboard</Link>
        </div>
      </section>
    </main>
  )
}
