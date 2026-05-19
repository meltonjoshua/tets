import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInScale { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(249,115,22,0.3)} 50%{box-shadow:0 0 40px rgba(249,115,22,0.6)} }
        @keyframes slide-in-left { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slide-in-right { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes count-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .anim-float { animation: float 3s ease-in-out infinite; }
        .anim-fade-up { animation: fadeInUp 0.8s ease-out both; }
        .anim-fade-scale { animation: fadeInScale 0.6s ease-out both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
        .delay-6 { animation-delay: 0.6s; }
        .delay-7 { animation-delay: 0.7s; }
        .delay-8 { animation-delay: 0.8s; }
        .delay-10 { animation-delay: 1.0s; }
        .shimmer-gradient {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
        .feature-card:hover .feature-icon {
          transform: scale(1.2) rotate(-5deg);
          transition: transform 0.3s ease;
        }
        .feature-card .feature-icon {
          transition: transform 0.3s ease;
        }
        .pricing-popular {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .nav-blur {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}} />

      <nav className="fixed top-0 inset-x-0 z-50 nav-blur bg-white/80 border-b border-gray-100/50">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md">OF</div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">OurFlat</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">Features</a>
            <a href="#how" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">How it works</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/auth/sign-in" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors hidden sm:block">Sign in</a>
            <a href="/auth/sign-up" className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all duration-300 hover:-translate-y-0.5">Get started free</a>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 sm:pt-44 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/80 via-white to-white pointer-events-none" />
        <div className="absolute top-20 -left-32 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 -right-32 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 lg:flex lg:gap-x-16 lg:px-8">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg anim-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/80 px-4 py-1.5 text-sm font-medium text-orange-700 ring-1 ring-orange-200/50 mb-6">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span></span>
              Now with AI assistant
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              One app for{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">two people</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-8 text-gray-600 max-w-lg">
              Shared shopping lists, chore tracking, meal planning with 9,300+ recipes, expense splitting, shared calendar, document vault, and an AI assistant — all in one beautiful app.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="/auth/sign-up"
                className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-orange-200 hover:shadow-2xl hover:shadow-orange-300 transition-all duration-300 hover:-translate-y-0.5"
              >
                Get started free
              </a>
              <a
                href="/dashboard"
                className="group flex items-center gap-2 text-base font-semibold text-gray-700 hover:text-orange-500 transition-colors"
              >
                Try the live demo
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-2">
                {['🧑','👩','🧑‍💻','👩‍🎨','🧑‍🍳'].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 ring-2 ring-white flex items-center justify-center text-sm">{emoji}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">Loved by 12,000+ couples</p>
              </div>
            </div>
          </div>

          <div className="mt-16 lg:mt-0 flex justify-center lg:justify-end anim-fade-up delay-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-[2rem] blur-2xl" />
              <div className="relative rounded-[2rem] bg-gradient-to-br from-orange-50 via-white to-amber-50 p-3 shadow-2xl ring-1 ring-gray-900/5 w-[320px] anim-float">
                <div className="rounded-[1.5rem] bg-white overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 pt-4 pb-3">
                    <p className="text-white/80 text-xs font-medium">Monday, 19 May</p>
                    <p className="text-white text-base font-bold mt-0.5">Good morning, Alex 👋</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-white/70 bg-white/20 px-2 py-0.5 rounded-full">☀️ 18°C</span>
                      <span className="text-[10px] text-white/70 bg-white/20 px-2 py-0.5 rounded-full">3 chores left</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <div className="rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 p-3 ring-1 ring-orange-100/50">
                      <div className="flex items-center gap-2">
                        <span className="text-base">✅</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900">Chores remaining</p>
                          <div className="mt-1.5 w-full bg-orange-200/50 rounded-full h-1.5">
                            <div className="bg-orange-500 h-1.5 rounded-full" style={{width:'40%'}} />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-orange-600">2/5</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-3 ring-1 ring-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                        <span className="text-xs text-gray-900 flex-1">Take out the bins</span>
                        <span className="text-[10px] text-gray-400">10:32</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-3 ring-1 ring-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs">🛒</div>
                        <span className="text-xs text-gray-900 flex-1">Whole milk, eggs, bread...</span>
                        <span className="text-[10px] bg-orange-100 text-orange-600 font-semibold px-1.5 py-0.5 rounded-full">8 left</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 p-3 ring-1 ring-orange-100/50">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🍛</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900">Thai Green Curry</p>
                          <p className="text-[10px] text-gray-500">25 min · Easy · Perfect for two</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-3 ring-1 ring-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">S</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-900"><span className="text-gray-500">Sam</span> completed "Put away groceries"</p>
                        </div>
                        <span className="text-[10px] text-gray-400">2m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { stat: '12,000+', label: 'Happy couples', emoji: '💑' },
              { stat: '9,300+', label: 'Recipes', emoji: '🍳' },
              { stat: '<1s', label: 'Sync speed', emoji: '⚡' },
              { stat: '4.9', label: 'App Store rating', emoji: '⭐' },
            ].map((item, i) => (
              <div key={i} className="text-center anim-fade-up" style={{ animationDelay: `${i * 0.1 + 0.3}s` }}>
                <div className="text-3xl mb-2">{item.emoji}</div>
                <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{item.stat}</div>
                <div className="text-sm text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center anim-fade-up">
          <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200/50 mb-4">Features</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Everything you need to run your home together
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            No more juggling six different apps. OurFlat brings it all together.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {[
            { title: 'Smart Shopping Lists', desc: 'Multiple lists, barcode scanning, recurring items, pantry integration, and one-tap add from recipes.', icon: '🛒', color: 'from-green-50 to-emerald-50' },
            { title: 'Meal Planning', desc: '9,300+ Gousto recipes, weekly planner, automatic shopping lists, cooking mode with voice control.', icon: '🍳', color: 'from-orange-50 to-amber-50' },
            { title: 'Chore Tracker', desc: 'Auto-rotating schedules, point system, streak tracking, deep cleaning checklists, photo proof.', icon: '✅', color: 'from-blue-50 to-cyan-50' },
            { title: 'Shared Calendar', desc: 'Merged view for both partners, event categories, "Who\'s Home?" widget, calendar sync.', icon: '📅', color: 'from-purple-50 to-violet-50' },
            { title: 'Expense Splitting', desc: 'Track shared expenses, auto-calculate who owes whom, receipt scanning, subscription tracker.', icon: '💰', color: 'from-amber-50 to-yellow-50' },
            { title: 'Notes & Documents', desc: 'Real-time collaborative notes, document vault with expiry tracking, location-based reminders.', icon: '📝', color: 'from-pink-50 to-rose-50' },
            { title: 'Pet & Plant Care', desc: 'Feeding schedules, vet appointments, watering reminders, pet walk logging.', icon: '🐾', color: 'from-teal-50 to-green-50' },
            { title: 'Habits & Goals', desc: 'Shared streaks, milestone celebrations, personal and couple goals, wellness tracking.', icon: '🎯', color: 'from-indigo-50 to-blue-50' },
            { title: 'AI Assistant', desc: 'Flatmate learns your patterns and proactively suggests meals, chores, and shopping items.', icon: '🤖', color: 'from-gray-50 to-slate-50' },
          ].map((feature, i) => (
            <div key={feature.title} className={`feature-card group relative rounded-2xl bg-gradient-to-br ${feature.color} p-6 ring-1 ring-gray-200/50 hover:ring-orange-200 hover:shadow-lg hover:shadow-orange-100/50 transition-all duration-300 hover:-translate-y-1 anim-fade-up`} style={{ animationDelay: `${i * 0.05 + 0.2}s` }}>
              <span className="feature-icon text-3xl inline-block">{feature.icon}</span>
              <h3 className="mt-3 text-base font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-orange-50/50 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center anim-fade-up">
            <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200/50 mb-4">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Built for two. Designed for speed.
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Every feature is designed around the reality of two people running a shared life.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[
              { step: '1', title: 'Create or join', desc: 'Create a household and invite your partner with a simple 6-character code.', emoji: '🏠' },
              { step: '2', title: 'Set up together', desc: 'Both partners get full access. Add your lists, chores, calendar events, and documents.', emoji: '🤝' },
              { step: '3', title: 'Stay in sync', desc: 'Every change syncs in under one second across all your devices. No refresh. No waiting.', emoji: '⚡' },
            ].map((item, i) => (
              <div key={item.step} className="relative flex flex-col items-center text-center group anim-fade-up" style={{ animationDelay: `${i * 0.15 + 0.3}s` }}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-2xl shadow-lg shadow-orange-200 group-hover:shadow-xl group-hover:shadow-orange-300 transition-all duration-300 group-hover:-translate-y-1">
                  {item.emoji}
                </div>
                <div className="mt-2 text-xs font-bold text-orange-500">Step {item.step}</div>
                <h3 className="mt-2 text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-text-secondary max-w-xs">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+48px)] w-[calc(100%-96px)] h-px border-t-2 border-dashed border-orange-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center anim-fade-up">
          <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200/50 mb-4">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Couples love OurFlat
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {[
            { quote: "We used to have 5 different apps for shopping, chores, calendar... now it's just OurFlat.", name: 'Emma & James', location: 'London', avatar: '👩‍❤️‍👨' },
            { quote: "The meal planning feature alone saves us £40/week on groceries. Game changer.", name: 'Priya & Dev', location: 'Manchester', avatar: '💑' },
            { quote: "Finally an app that gets it — two people, one home, one app. Brilliant.", name: 'Tom & Marco', location: 'Edinburgh', avatar: '🏠' },
          ].map((t, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/50 shadow-sm hover:shadow-md transition-shadow anim-fade-up" style={{ animationDelay: `${i * 0.1 + 0.3}s` }}>
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl">{t.avatar}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center anim-fade-up">
            <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200/50 mb-4">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Simple pricing, incredible value
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Less than a single takeaway coffee per month.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-2xl lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 ring-1 ring-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-gray-900">Free</h3>
              <p className="mt-2 text-sm text-text-secondary">Everything you need to get started</p>
              <p className="mt-6"><span className="text-5xl font-extrabold text-gray-900">£0</span></p>
              <ul className="mt-8 space-y-3">
                {['Up to 3 shopping lists', 'Basic chore tracker (10 chores)', 'Shared calendar with sync', '5 recipes per week', 'Basic expense splitting', 'Shared notes & lists'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/auth/sign-up"
                className="mt-8 block rounded-full bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
              >
                Get started free
              </a>
            </div>

            <div className="pricing-popular relative rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white shadow-2xl ring-1 ring-orange-400/50">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-4 py-1 text-xs font-bold text-orange-900 shadow-lg">Most Popular</div>
              <div className="flex items-center gap-2 mt-2">
                <h3 className="text-lg font-bold">OurFlat Plus</h3>
              </div>
              <p className="mt-2 text-sm text-white/80">The complete experience for couples</p>
              <p className="mt-6"><span className="text-5xl font-extrabold">£4.99</span><span className="text-base font-normal text-white/70">/mo</span></p>
              <div className="mt-2 relative h-1 w-full overflow-hidden rounded-full bg-white/20">
                <div className="shimmer-gradient absolute inset-0" />
              </div>
              <ul className="mt-8 space-y-3">
                {['Unlimited everything', 'Pantry tracker & expiry alerts', 'AI assistant (Flatmate)', 'Receipt scanning', 'Document vault', 'Pet & plant care modules', 'Habit tracking & goals', 'Package tracking', 'Cooking mode with voice', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/90">
                    <svg className="w-5 h-5 text-amber-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/auth/sign-up"
                className="mt-8 block rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-orange-600 hover:bg-gray-50 transition-colors shadow-lg"
              >
                Start free trial
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs">OF</div>
              <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">OurFlat</span>
            </div>
            <p className="text-sm text-text-secondary">
              &copy; 2026 OurFlat. One app. Two people. Always in sync.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}