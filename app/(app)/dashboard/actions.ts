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

  const { error } = await supabase
    .from('challenges')
    .insert({ user_id: user.id, title, cadence })

  if (error) {
    // optionally log error here; do not return an object
    return
  }

  // refresh the list
  revalidatePath('/dashboard')
}

