'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { api, getErrorMessage } from '@/lib/api';

type Status = 'verifying' | 'success' | 'error';

function VerifyEmailStatus() {
  const token = useSearchParams().get('token');
  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'error');
  const [message, setMessage] = useState(token ? '' : 'This verification link is missing its token.');
  // Tokens are single-use, so make sure the request is only sent once (effects run twice in dev)
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;

    api
      .post('/auth/verify-email', {}, { params: { token } })
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setMessage(getErrorMessage(err, 'This verification link is invalid or has expired.'));
      });
  }, [token]);

  if (status === 'verifying') {
    return (
      <div className="text-center text-gray-400 flex flex-col items-center gap-4">
        <Loader2 className="animate-spin" size={40} />
        Verifying your email...
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto mb-6 text-[#00C853]" size={48} />
        <h1 className="text-3xl font-bold tracking-tight mb-2">Email verified</h1>
        <p className="text-gray-400 mb-8">Your account is active. You can now sign in.</p>
        <Link
          href="/login"
          className="inline-block w-full bg-white text-black font-semibold rounded-lg px-4 py-3 hover:bg-gray-200 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <XCircle className="mx-auto mb-6 text-red-400" size={48} />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Verification failed</h1>
      <p className="text-gray-400 mb-8">{message}</p>
      <Link href="/register" className="text-white hover:underline text-sm">
        Create an account
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-below-nav flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[448px] bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
      >
        <Suspense fallback={<p className="text-center text-gray-400">Loading...</p>}>
          <VerifyEmailStatus />
        </Suspense>
      </motion.div>
    </div>
  );
}
