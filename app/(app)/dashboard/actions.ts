'use server'

import { createSupabaseServer } from '@/lib/supabase/server'

export async function addChallenge(formData: FormData) {
  const title = (formData.get('title') as string)?.trim()
  const cadence = (formData.get('cadence') as string) || 'daily'
  if (!title) return { error: 'Title is required' }

  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('challenges')
    .insert({ user_id: user.id, title, cadence })

  if (error) return { error: error.message }
  return { ok: true }
}
