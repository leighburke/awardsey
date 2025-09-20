/**
 * Compute current day-by-day streak from an array of YYYY-MM-DD dates.
 * Assumes dates are unique strings (we'll dedupe anyway).
 */
export function computeCurrentStreak(datesISO: string[]): number {
  const uniq = Array.from(new Set(datesISO))
  const set = new Set(uniq)
  let streak = 0
  const d = new Date()
  d.setHours(0, 0, 0, 0)

  while (true) {
    const iso = d.toISOString().slice(0, 10)
    if (set.has(iso)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

/**
 * True if entry exists for 'today'
 */
export function isDoneToday(datesISO: string[]): boolean {
  const today = new Date()
  today.setHours(0,0,0,0)
  const t = today.toISOString().slice(0,10)
  return new Set(datesISO).has(t)
}
