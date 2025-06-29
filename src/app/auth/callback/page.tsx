'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';

    if (!code) {
      setStatus('error');
      return;
    }

    const callbackUrl = `/api/auth/callback?code=${code}&next=${encodeURIComponent(next)}`;

    fetch(callbackUrl)
      .then((res) => {
        if (res.redirected) {
          window.location.href = res.url;
        } else {
          setStatus('error');
        }
      })
      .catch(() => {
        setStatus('error');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-white px-6">
      <div className="text-center space-y-4">
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-2" />
              <h2 className="text-xl font-semibold">Verifying your email...</h2>
              <p className="text-gray-600">Please wait while we complete your sign in.</p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <XCircle className="h-12 w-12 text-red-500 mb-2" />
              <h2 className="text-xl font-semibold text-red-600">Verification failed</h2>
              <p className="text-gray-600">Something went wrong. Please try logging in again.</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
              <h2 className="text-xl font-semibold text-green-600">Email verified!</h2>
              <p className="text-gray-600">Redirecting you to your dashboard...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
