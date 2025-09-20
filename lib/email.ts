import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY
if (!apiKey) {
  console.warn('RESEND_API_KEY missing – waitlist emails will be skipped.')
}
const resend = apiKey ? new Resend(apiKey) : undefined

export async function sendWaitlistThanks(to: string) {
  if (!resend) return
  const fromEnv = process.env.NEXT_PUBLIC_SITE_FROM_EMAIL
  // Use Resend’s dev-friendly sender if you haven’t verified a domain yet:
  const from = fromEnv || 'onboarding@resend.dev'

  await resend.emails.send({
    from: `Awardsey <${from}>`,
    to,
    subject: "You're on the waitlist 🎉",
    html: `
      <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
        <h2>Thanks for joining the Awardsey waitlist!</h2>
        <p>We’ll let you know as soon as we’re ready for you.</p>
        <p>— The Awardsey team</p>
      </div>
    `,
  })
}
