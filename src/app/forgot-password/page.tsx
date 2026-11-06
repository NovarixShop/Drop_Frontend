'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MailCheck } from 'lucide-react';
import { api, getErrorMessage } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Something went wrong. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-below-nav flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[448px] bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
      >
        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto mb-6 text-[#00C853]" size={48} />
            <h1 className="text-3xl font-bold tracking-tight mb-2">Check your email</h1>
            <p className="text-gray-400 mb-8">
              If an account exists for <span className="text-white">{email}</span>, we&apos;ve sent a link to reset
              your password. The link is valid for 1 hour.
            </p>
            <Link href="/login" className="text-white hover:underline text-sm">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Forgot password?</h1>
              <p className="text-gray-400">Enter your email and we&apos;ll send you a reset link</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black font-semibold rounded-lg px-4 py-3 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-400">
              Remembered it?{' '}
              <Link href="/login" className="text-white hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
