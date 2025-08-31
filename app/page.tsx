export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70">
          🚀 Awardsey
          <span className="h-4 w-px bg-white/10" />
          Build habits. Win awards.
        </div>

        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Turn goals into streaks — and streaks into <span className="text-white/70">rewards</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-white/70 sm:text-lg">
          Create or join challenges, track progress, and collect digital awards.
          Launch your next habit with a tap.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#"
            className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-white/90"
          >
            Get started
          </a>
          <a
            href="#features"
            className="rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white/80 hover:bg-white/5"
          >
            See features
          </a>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          <Feature title="Challenges" desc="Daily, weekly, or custom rules with streaks." />
          <Feature title="Awards" desc="Earn trophies, badges, and shareable cards." />
          <Feature title="Teams" desc="Compete with friends or your community." />
        </div>
      </section>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/70">{desc}</p>
    </div>
  );
}
