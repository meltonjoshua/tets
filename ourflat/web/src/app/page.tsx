import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:gap-x-20 lg:px-8 lg:pt-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              One app for <span className="text-primary">two people</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Shared shopping lists, chore tracking, meal planning with 9,300+ recipes,
              expense splitting, shared calendar, document vault, and an AI assistant —
              all in one beautiful app that syncs in real time.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="/auth/sign-up"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
              >
                Get started free
              </a>
              <a
                href="#features"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors"
              >
                See all features <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="mx-auto mt-16 lg:mt-0 flex max-w-md lg:max-w-none">
            <div className="relative rounded-3xl bg-gradient-to-br from-orange-50 to-amber-100 p-8 shadow-2xl ring-1 ring-gray-900/5 w-80">
              <div className="space-y-4">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-gray-900">Good morning, Alex 👋</p>
                  <p className="text-xs text-gray-500 mt-1">Monday, 19 May</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-primary">3 chores remaining</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-warning" />
                      <span className="text-xs text-gray-600">Do the dishes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-info" />
                      <span className="text-xs text-gray-600">Vacuum living room</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      <span className="text-xs text-gray-600">Water the plants</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-gray-900">🛒 Shopping list (5 items)</p>
                  <p className="text-xs text-gray-500 mt-1">Milk, eggs, bread, butter, chicken</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-gray-900">🍽️ Dinner tonight</p>
                  <p className="text-xs text-gray-500 mt-1">Thai Green Curry — 30 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to run your home together
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            No more juggling six different apps. OurFlat brings it all together.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {[
            { title: 'Smart Shopping Lists', desc: 'Multiple lists, barcode scanning, recurring items, pantry integration, and one-tap add from recipes.', icon: '🛒' },
            { title: 'Meal Planning', desc: '9,300+ Gousto recipes, weekly planner, automatic shopping lists, cooking mode with voice control.', icon: '🍳' },
            { title: 'Chore Tracker', desc: 'Auto-rotating schedules, point system, streak tracking, deep cleaning checklists, photo proof.', icon: '✅' },
            { title: 'Shared Calendar', desc: 'Merged view for both partners, event categories, "Who\'s Home?" widget, calendar sync.', icon: '📅' },
            { title: 'Expense Splitting', desc: 'Track shared expenses, auto-calculate who owes whom, receipt scanning, subscription tracker.', icon: '💰' },
            { title: 'Notes & Documents', desc: 'Real-time collaborative notes, document vault with expiry tracking, location-based reminders.', icon: '📝' },
            { title: 'Pet & Plant Care', desc: 'Feeding schedules, vet appointments, watering reminders, pet walk logging.', icon: '🐾' },
            { title: 'Habits & Goals', desc: 'Shared streaks, milestone celebrations, personal and couple goals, wellness tracking.', icon: '🎯' },
            { title: 'AI Assistant', desc: 'Flatmate learns your patterns and proactively suggests meals, chores, and shopping items.', icon: '🤖' },
          ].map((feature) => (
            <div key={feature.title} className="rounded-2xl bg-surface p-6 ring-1 ring-inset ring-border">
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="mt-3 text-base font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-primary-light">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Built for two. Designed for speed.
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Every feature is designed around the reality of two people running a shared life.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[
              { step: '1', title: 'Create or join', desc: 'Create a household and invite your partner with a simple 6-character code.' },
              { step: '2', title: 'Set up together', desc: 'Both partners get full access. Add your lists, chores, calendar events, and documents.' },
              { step: '3', title: 'Stay in sync', desc: 'Every change syncs in under one second across all your devices. No refresh. No waiting.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Simple pricing, incredible value
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Less than a single takeaway coffee per month.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-2xl lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 ring-1 ring-border">
            <h3 className="text-lg font-semibold text-gray-900">Free</h3>
            <p className="mt-2 text-sm text-text-secondary">Everything you need to get started</p>
            <p className="mt-6 text-4xl font-bold text-gray-900">£0</p>
            <ul className="mt-8 space-y-3 text-sm text-gray-600">
              <li>✓ Up to 3 shopping lists</li>
              <li>✓ Basic chore tracker (10 chores)</li>
              <li>✓ Shared calendar with sync</li>
              <li>✓ 5 recipes per week</li>
              <li>✓ Basic expense splitting</li>
              <li>✓ Shared notes & lists</li>
            </ul>
            <a
              href="/auth/sign-up"
              className="mt-8 block rounded-xl bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              Get started free
            </a>
          </div>

          <div className="rounded-2xl bg-primary p-8 text-white ring-1 ring-primary">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">OurFlat Plus</h3>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">Popular</span>
            </div>
            <p className="mt-2 text-sm text-white/80">The complete experience</p>
            <p className="mt-6 text-4xl font-bold">£4.99<span className="text-base font-normal text-white/70">/mo</span></p>
            <ul className="mt-8 space-y-3 text-sm text-white/90">
              <li>✓ Unlimited everything</li>
              <li>✓ Pantry tracker & expiry alerts</li>
              <li>✓ AI assistant (Flatmate)</li>
              <li>✓ Receipt scanning</li>
              <li>✓ Document vault</li>
              <li>✓ Pet & plant care modules</li>
              <li>✓ Habit tracking & goals</li>
              <li>✓ Package tracking</li>
              <li>✓ Cooking mode with voice</li>
              <li>✓ Priority support</li>
            </ul>
            <a
              href="/auth/sign-up"
              className="mt-8 block rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-primary hover:bg-gray-50 transition-colors"
            >
              Start free trial
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">OurFlat</span>
            </div>
            <p className="text-sm text-text-secondary">
              © 2026 OurFlat. One app. Two people. Always in sync.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}