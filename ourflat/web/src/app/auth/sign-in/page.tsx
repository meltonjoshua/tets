'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-shift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float-orb {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-gradient { background-size: 200% 200%; animation: gradient-shift 8s ease infinite; }
        .anim-orb { animation: float-orb 6s ease-in-out infinite; }
        .anim-fade-in { animation: fade-in-up 0.6s ease-out both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
        .delay-6 { animation-delay: 0.6s; }
      `}} />

      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 anim-gradient bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl anim-orb" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl anim-orb" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-orange-300/20 rounded-full blur-2xl anim-orb" style={{ animationDelay: '4s' }} />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="anim-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold">OF</div>
              <span className="text-2xl font-bold text-white">OurFlat</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              One app for<br />two people.
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-md">
              Shared shopping lists, chore tracking, meal planning, expense splitting, and more — all beautifully synced.
            </p>
          </div>
          <div className="mt-12 space-y-4">
            {[
              { emoji: '🛒', text: 'Smart shopping lists that sync instantly' },
              { emoji: '✅', text: 'Chore tracking with auto-rotation' },
              { emoji: '🍽️', text: '9,300+ recipes & meal planning' },
              { emoji: '💰', text: 'Expense splitting made simple' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-3 anim-fade-in delay-${i + 2}`}>
                <span className="text-xl">{item.emoji}</span>
                <span className="text-white/90 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 bg-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="sm:mx-auto sm:w-full sm:max-w-sm relative">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md">OF</div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">OurFlat</span>
          </div>

          <div className="anim-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-500">Sign in to your account to continue</p>
          </div>

          <div className="mt-6 anim-fade-in delay-1">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              🎉 Try the Live Demo
            </button>
            <p className="mt-2 text-center text-xs text-gray-400">
              Explore all features with sample data — no account needed
            </p>
          </div>

          <div className="my-6 flex items-center anim-fade-in delay-2">
            <div className="flex-1 border-t border-gray-200" />
            <div className="px-3 text-xs text-gray-400 uppercase tracking-wider">or connect your account</div>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 anim-fade-in delay-2 shadow-sm">
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.3v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center anim-fade-in delay-3">
            <div className="flex-1 border-t border-gray-200" />
            <div className="px-3 text-xs text-gray-400">or</div>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200/50">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 anim-fade-in delay-3">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all duration-200 sm:text-sm"
                placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all duration-200 sm:text-sm"
                  placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.654 3.654m0 0a3 3 0 104.243 4.243M13.12 13.12l3.654 3.654M15.88 17.88L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-gray-200">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
          </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 anim-fade-in delay-4">
            Don&apos;t have an account?{' '}
            <a href="/auth/sign-up" className="font-semibold text-orange-500 hover:text-orange-600 transition-colors">Sign up free</a>
          </p>
        </div>
      </div>
    </div>
  );
}