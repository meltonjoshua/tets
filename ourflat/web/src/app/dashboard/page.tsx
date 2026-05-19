import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/sign-in');
  }

  const userName = session.user.user_metadata?.display_name ?? session.user.email?.split('@')[0] ?? 'there';

  const modules = [
    { name: 'Shopping', desc: 'Shared grocery lists & pantry tracker', icon: '🛒', href: '/dashboard/shopping', color: 'bg-orange-50' },
    { name: 'Meals', desc: '9,300+ recipes & weekly planner', icon: '🍳', href: '/dashboard/meals', color: 'bg-amber-50' },
    { name: 'Chores', desc: 'Schedules, streaks & fair rotation', icon: '✅', href: '/dashboard/chores', color: 'bg-green-50' },
    { name: 'Calendar', desc: 'Shared events & scheduling', icon: '📅', href: '/dashboard/calendar', color: 'bg-blue-50' },
    { name: 'Money', desc: 'Split expenses & track bills', icon: '💰', href: '/dashboard/money', color: 'bg-emerald-50' },
    { name: 'Notes', desc: 'Collaborative notes & document vault', icon: '📝', href: '/dashboard/notes', color: 'bg-purple-50' },
    { name: 'Pets', desc: 'Feeding, walks & vet visits', icon: '🐾', href: '/dashboard/pets', color: 'bg-pink-50' },
    { name: 'Plants', desc: 'Watering schedules & care tips', icon: '🌿', href: '/dashboard/plants', color: 'bg-lime-50' },
    { name: 'Habits', desc: 'Track habits & set shared goals', icon: '🎯', href: '/dashboard/habits', color: 'bg-red-50' },
    { name: 'Packages', desc: 'Track deliveries & errands', icon: '📦', href: '/dashboard/packages', color: 'bg-yellow-50' },
    { name: 'Flatmate AI', desc: 'Your intelligent home assistant', icon: '🤖', href: '/dashboard/flatmate', color: 'bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Good morning, {userName} 👋</h1>
              <p className="mt-1 text-orange-100">
                {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <form action={async () => {
              'use server';
              const supabase = await createClient();
              await supabase.auth.signOut();
              redirect('/auth/sign-in');
            }}>
              <button type="submit" className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors">
                Sign out
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Link href="/dashboard/shopping" className="rounded-xl bg-white/15 p-4 text-center hover:bg-white/25 transition-colors">
              <span className="text-2xl">🛒</span>
              <p className="mt-1 text-xs font-medium">Add Item</p>
            </Link>
            <Link href="/dashboard/chores" className="rounded-xl bg-white/15 p-4 text-center hover:bg-white/25 transition-colors">
              <span className="text-2xl">✅</span>
              <p className="mt-1 text-xs font-medium">Log Chore</p>
            </Link>
            <Link href="/dashboard/meals" className="rounded-xl bg-white/15 p-4 text-center hover:bg-white/25 transition-colors">
              <span className="text-2xl">🍽️</span>
              <p className="mt-1 text-xs font-medium">Dinner?</p>
            </Link>
            <Link href="/dashboard/flatmate" className="rounded-xl bg-white/15 p-4 text-center hover:bg-white/25 transition-colors">
              <span className="text-2xl">🤖</span>
              <p className="mt-1 text-xs font-medium">Ask Flatmate</p>
            </Link>
          </div>
        </div>
      </header>

      {/* Module Grid */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Link
              key={mod.name}
              href={mod.href}
              className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-all"
            >
              <div className={`inline-flex rounded-xl ${mod.color} p-3`}>
                <span className="text-2xl">{mod.icon}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {mod.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{mod.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}