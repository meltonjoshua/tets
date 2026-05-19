'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
        .delay-7 { animation-delay: 0.7s; }
      `}} />

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
              Start running<br />your home together
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-md">
              Join thousands of couples who manage shared shopping lists, chores, meals, and finances — all in one place.
            </p>
          </div>
          <div className="mt-12 space-y-6">
            {[
              { emoji: '🏠', label: 'Create a household', desc: 'Set up your shared space in 30 seconds' },
              { emoji: '🔗', label: 'Invite your partner', desc: 'Share a simple 6-character code' },
              { emoji: '⚡', label: 'Stay in sync', desc: 'Real-time updates across all devices' },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-4 anim-fade-in delay-${i + 2}`}>
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-lg shrink-0">{item.emoji}</div>
                <div>
                  <p className="text-white font-semibold">{item.label}</p>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-4 rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 anim-fade-in delay-5">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['🧑','👩','🧑‍💻','👩‍🎨'].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/20 ring-2 ring-white/30 flex items-center justify-center text-sm">{emoji}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4 text-amber-300 fill-amber-300" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-white/70 text-xs mt-0.5">&ldquo;Finally, an app that gets how couples actually live.&rdquo;</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 bg-white relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-sm relative">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md">OF</div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">OurFlat</span>
          </div>

          <div className="anim-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-500">Start running your shared home together</p>
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
            <div className="px-3 text-xs text-gray-400 uppercase tracking-wider">or create account</div>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl p-4 mb-4 anim-fade-in delay-2">
            <p className="text-sm text-amber-800">
              💡 <strong>Want to create an account?</strong> You&apos;ll need a Supabase project first. Click &quot;Try the Live Demo&quot; to explore all features right now.
            </p>
          </div>

          <form className="space-y-4 anim-fade-in delay-3">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Display name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all duration-200 sm:text-sm"
                placeholder="Your name" />
            </div>
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
                  placeholder="8+ characters" />
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
            <button type="submit"
              className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-gray-200">
              Create account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 anim-fade-in delay-4">
            Already have an account?{' '}
            <a href="/auth/sign-in" className="font-semibold text-orange-500 hover:text-orange-600 transition-colors">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}