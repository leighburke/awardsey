'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function joinWaitlist(formData: FormData): Promise<void> {
  const email = (formData.get('email') as string | null)?.trim().toLowerCase() || ''
  const source = (formData.get('source') as string | null) || 'home_hero'
  if (!email || !email.includes('@')) return

  const supabase = createSupabaseServer() // server-side anon client
  const { error } = await supabase.from('waitlist').insert({ email, source })
  if (!error) revalidatePath('/')
}
