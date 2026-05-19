'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // In demo mode, any login redirects to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-3xl font-bold text-orange-500">OurFlat</h1>
        <h2 className="mt-4 text-center text-xl font-semibold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-500">One app. Two people. Always in sync.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        {/* DEMO MODE BUTTON - most prominent */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-md shadow-orange-200"
        >
          🎉 Try the Live Demo
        </button>

        <p className="mt-3 text-center text-xs text-gray-400">
          Explore all features with sample data — no account needed
        </p>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200" />
          <div className="px-3 text-xs text-gray-400 uppercase tracking-wider">or connect your account</div>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <button
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.3v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200" />
          <div className="px-3 text-xs text-gray-400">or</div>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              placeholder="Enter your password" />
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors">
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <a href="/auth/sign-up" className="font-semibold text-orange-500 hover:text-orange-600">Sign up</a>
        </p>
      </div>
    </div>
  );
}
