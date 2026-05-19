'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-3xl font-bold text-orange-500">OurFlat</h1>
        <h2 className="mt-4 text-center text-xl font-semibold text-gray-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-500">Start running your shared home together</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        {/* DEMO MODE BUTTON */}
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
          <div className="px-3 text-xs text-gray-400 uppercase tracking-wider">or create account</div>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-amber-800">
            💡 <strong>Want to create an account?</strong> You&apos;ll need a Supabase project first. Click &quot;Try the Live Demo&quot; to explore all features right now.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/auth/sign-in" className="font-semibold text-orange-500 hover:text-orange-600">Sign in</a>
        </p>
      </div>
    </div>
  );
}
