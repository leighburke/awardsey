'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowser();

      try {
        // Try PKCE/code exchange using the full current URL (OAuth & magic link)
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );

        if (exchangeError) {
          // Fallback: some magic link variants already set a session; just verify
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) throw exchangeError;
        }

        // Success → go to dashboard
        router.replace('/dashboard');
      } catch (e) {
        // Failure → bounce back to login with a hint
        console.warn('[callback] exchange error:', e);
        router.replace('/login?error=callback');
      }
    })();
  }, [router]);

  return (
    <main className="p-8">
      <p className="text-sm text-gray-600">Signing you in…</p>
    </main>
  );
}

