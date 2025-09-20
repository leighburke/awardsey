'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServer } from '@/lib/supabase/server'
import { sendWaitlistThanks } from '@/lib/email'

export async function joinWaitlist(formData: FormData): Promise<void> {
  const emailRaw = formData.get('email')
  const sourceRaw = formData.get('source')
  const email = (typeof emailRaw === 'string' ? emailRaw : '').trim().toLowerCase()
  const source = (typeof sourceRaw === 'string' ? sourceRaw : 'home_hero')

  if (!email || !email.includes('@')) return

  const supabase = createSupabaseServer()
  const { error } = await supabase.from('waitlist').insert({ email, source })

  if (!error) {
    // Fire-and-forget email; don’t block the user flow
    sendWaitlistThanks(email).catch(() => {})
    revalidatePath('/')
  }
}
