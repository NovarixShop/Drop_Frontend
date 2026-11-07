'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import api from '@/lib/api'; // assuming api is in lib
import { toast } from 'sonner';

// Where to go after signing in: the ?redirect= path if it stays on this site, otherwise home
const getRedirectPath = (): string => {
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  return redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/';
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      router.push(getRedirectPath());
    } catch {
      // Error is handled in the store
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const res = await api.post('/auth/google-login', {
        idToken: credentialResponse.credential,
      });
      
      // Update auth store with response data
      useAuthStore.setState({ 
        user: res.data.data.user, 
        accessToken: res.data.data.accessToken,
        isAuthenticated: true 
      });
      
      toast.success('Successfully logged in with Google');
      router.push(getRedirectPath());
    } catch (err) {
      console.error('Google login failed:', err);
      toast.error('Google login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-below-nav flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[448px] bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your NOVARIX account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                toast.error('Google Sign In failed');
              }}
            />
          </div>
        </GoogleOAuthProvider>
        
        <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
              placeholder="••••••••"
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
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
