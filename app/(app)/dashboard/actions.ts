'use server'

import { createSupabaseServer } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addChallenge(formData: FormData): Promise<void> {
  const title = (formData.get('title') as string | null)?.trim() || ''
  const cadence = (formData.get('cadence') as string | null) || 'daily'
  if (!title) return

  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('challenges').insert({ user_id: user.id, title, cadence })
  revalidatePath('/dashboard')
}

export async function markDoneToday(formData: FormData): Promise<void> {
  const challengeId = (formData.get('challenge_id') as string | null)?.trim() || ''
  if (!challengeId) return

  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // YYYY-MM-DD for "today" in UTC (date-only)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const entry_date = today.toISOString().slice(0, 10)

  // Upsert to avoid duplicate error if already marked today
  await supabase
    .from('challenge_entries')
    .upsert(
      { challenge_id: challengeId, user_id: user.id, entry_date },
      { onConflict: 'challenge_id,user_id,entry_date', ignoreDuplicates: true }
    )

  revalidatePath('/dashboard')
}
