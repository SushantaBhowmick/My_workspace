'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/supabaseClient';
import showToast from '@/components/showToast';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error }) => {
          if (!error) {
            showToast.success("Redirecting you to the dash board page.")
            router.replace('/dashboard');
          } else {
            console.error('Session exchange failed:', error.message);
            showToast.error('Verification failed. Please try logging in again.')
            router.replace('/login');
          }
        });
    } else {
      router.replace('/login');
    }
  }, [searchParams, router, supabase]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-medium text-gray-700">Verifying your account...</p>
    </div>
  );
}
