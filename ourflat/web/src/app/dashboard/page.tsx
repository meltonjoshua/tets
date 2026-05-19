'use client';
import { useDemoAuth, DEMO_USER, DEMO_PARTNER } from '@/hooks/useDemoAuth';
import { shoppingLists, todayChores, allChores, mealPlan, todayEvents, upcomingBills, recentExpenses, packages, partnerActivity, plants, pets, habits, notes, savingsGoals } from '@/lib/demo-data';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, household } = useDemoAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'shopping' | 'meals' | 'chores' | 'calendar' | 'money' | 'more'>('home');
  const [shoppingItems, setShoppingItems] = useState(shoppingLists[0].items);
  const [chores, setChores] = useState(allChores);
  const [checkedHabits, setCheckedHabits] = useState<string[]>(['hab-1', 'hab-4']);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const toggleShopItem = (id: string) => {
    setShoppingItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };
  const toggleChore = (id: string) => {
    setChores(prev => prev.map(ch => ch.id === id ? { ...ch, is_completed: !ch.is_completed } : ch));
  };
  const toggleHabit = (id: string) => {
    setCheckedHabits(prev => prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]);
  };
  const userName = user.display_name;
  const partnerName = household.partner?.display_name ?? 'Partner';
  const uncheckedItems = shoppingItems.filter(i => !i.checked);
  const checkedItems = shoppingItems.filter(i => i.checked);
  const remainingChores = chores.filter(c => !c.is_completed);
  const completedChores = chores.filter(c => c.is_completed);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="mx-auto max-w-2xl px-5 pt-14 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">{today}</p>
              <h1 className="text-2xl font-bold mt-0.5">{greeting}, {userName} 👋</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                {household.name}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-5 grid grid-cols-4 gap-2">
            <button onClick={() => setActiveTab('shopping')} className="flex flex-col items-center gap-1 rounded-xl bg-white/15 p-3 backdrop-blur-sm hover:bg-white/25 transition-colors">
              <span className="text-xl">🛒</span>
              <span className="text-[10px] font-medium text-orange-100">Add Item</span>
            </button>
            <button onClick={() => setActiveTab('chores')} className="flex flex-col items-center gap-1 rounded-xl bg-white/15 p-3 backdrop-blur-sm hover:bg-white/25 transition-colors">
              <span className="text-xl">✅</span>
              <span className="text-[10px] font-medium text-orange-100">Log Chore</span>
            </button>
            <button onClick={() => setActiveTab('meals')} className="flex flex-col items-center gap-1 rounded-xl bg-white/15 p-3 backdrop-blur-sm hover:bg-white/25 transition-colors">
              <span className="text-xl">🍽️</span>
              <span className="text-[10px] font-medium text-orange-100">Dinner?</span>
            </button>
            <button onClick={() => setActiveTab('more')} className="flex flex-col items-center gap-1 rounded-xl bg-white/15 p-3 backdrop-blur-sm hover:bg-white/25 transition-colors">
              <span className="text-xl">🤖</span>
              <span className="text-[10px] font-medium text-orange-100">Flatmate</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tab Bar */}
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-2xl flex overflow-x-auto no-scrollbar">
          {(['home','shopping','meals','chores','calendar','money','more'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[60px] py-3 px-2 text-center text-xs font-medium capitalize transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab ? 'text-orange-600 border-orange-500' : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}>
              {tab === 'home' ? '🏠 Home' : tab === 'shopping' ? '🛒 Shop' : tab === 'meals' ? '🍽️ Meals' : tab === 'chores' ? '✅ Chores' : tab === 'calendar' ? '📅 Cal' : tab === 'money' ? '💰 Money' : '⚙️ More'}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-5 py-5 pb-24 space-y-5">

        {/* ============ HOME TAB ============ */}
        {activeTab === 'home' && (
          <>
            {/* Today's Schedule */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">Today's Schedule</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                {todayEvents.map(ev => (
                  <div key={ev.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xs font-medium text-gray-400 w-16 shrink-0">{ev.time}</span>
                    <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                      ev.category === 'health' ? 'bg-green-500' : ev.category === 'work' ? 'bg-blue-500' : ev.category === 'shared' ? 'bg-orange-500' : 'bg-purple-500'
                    }`}></span>
                    <span className="text-sm text-gray-900 flex-1">{ev.title}</span>
                    {ev.for_user && <span className="text-[10px] text-gray-400">{ev.for_user === user.id ? 'You' : partnerName}</span>}
                    {!ev.for_user && <span className="text-[10px] text-orange-500 font-medium">Both</span>}
                  </div>
                ))}
              </div>
            </section>

            {/* Chores Quick View */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-gray-900">Chores ({remainingChores.length} remaining)</h2>
                <button onClick={() => setActiveTab('chores')} className="text-sm text-orange-600 font-medium">See all →</button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                {chores.slice(0, 4).map(ch => (
                  <div key={ch.id} className="flex items-center gap-3 px-4 py-3">
                    <button onClick={() => toggleChore(ch.id)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                      ch.is_completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-orange-400'
                    }`}>
                      {ch.is_completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <span className={`text-sm flex-1 ${ch.is_completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{ch.title}</span>
                    {ch.assigned_to && <span className="text-[10px] text-gray-400">{ch.assigned_to === user.id ? 'You' : partnerName}</span>}
                    <span className="text-[10px] text-gray-300">{ch.estimated_minutes}m</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Shopping Quick View */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-gray-900">Shopping ({uncheckedItems.length} items)</h2>
                <button onClick={() => setActiveTab('shopping')} className="text-sm text-orange-600 font-medium">See all →</button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                {shoppingItems.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                    <button onClick={() => toggleShopItem(item.id)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                      item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-orange-400'
                    }`}>
                      {item.checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <span className={`text-sm flex-1 ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>{item.name}</span>
                    {item.quantity > 1 && <span className="text-xs text-gray-400">{item.quantity} {item.unit}</span>}
                    {item.priority && <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">!</span>}
                  </div>
                ))}
              </div>
            </section>

            {/* Dinner Tonight */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">Dinner Tonight</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4">
                  <p className="text-lg font-semibold text-gray-900">Thai Green Curry 🍛</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">⏱️ 25 min</span>
                    <span className="text-xs text-gray-500">🌟 Easy</span>
                    <span className="text-xs text-orange-600 font-medium">Perfect for two</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">3 items added to your shopping list</p>
                </div>
              </div>
            </section>

            {/* Coming Up */}
            {(upcomingBills.filter(b => !b.is_paid).length > 0 || packages.filter(p => p.status !== 'delivered').length > 0) && (
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">Coming Up</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                  {upcomingBills.filter(b => !b.is_paid).slice(0, 2).map(bill => (
                    <div key={bill.id} className="flex items-center gap-3 px-4 py-3">
                      <span className="text-lg">💰</span>
                      <span className="text-sm text-gray-900 flex-1">{bill.title}</span>
                      <span className="text-sm font-semibold text-gray-900">£{bill.amount}</span>
                      <span className="text-xs text-gray-400">Due {bill.due}</span>
                    </div>
                  ))}
                  {packages.filter(p => p.status !== 'delivered').slice(0, 2).map(pkg => (
                    <div key={pkg.id} className="flex items-center gap-3 px-4 py-3">
                      <span className="text-lg">📦</span>
                      <span className="text-sm text-gray-900 flex-1">{pkg.title}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        pkg.status === 'out_for_delivery' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                      }`}>{pkg.status === 'out_for_delivery' ? 'Out for delivery' : pkg.status === 'shipped' ? 'Shipped' : 'Pending'}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Partner Activity */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{partnerName}'s Activity</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                {partnerActivity.map(act => (
                  <div key={act.id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">{partnerName[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate"><span className="text-gray-500">{act.action}</span> {act.item}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{act.time}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ============ SHOPPING TAB ============ */}
        {activeTab === 'shopping' && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Shopping Lists</h2>
              <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full">{uncheckedItems.length} items</span>
            </div>

            {/* List tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {shoppingLists.map(list => (
                <button key={list.id} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  list.id === 'list-1' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                  {list.icon} {list.name}
                </button>
              ))}
            </div>

            {/* Unchecked items */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">To buy</h3>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                {uncheckedItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <button onClick={() => toggleShopItem(item.id)} className="w-5 h-5 rounded-md border-2 border-gray-300 hover:border-orange-400 shrink-0 transition-colors"></button>
                    <span className="text-sm text-gray-900 flex-1">{item.name}</span>
                    {item.quantity > 1 && <span className="text-xs text-gray-400">{item.quantity} {item.unit}</span>}
                    {item.priority && <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">Priority</span>}
                    {item.assigned_to && <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{item.assigned_to === user.id ? 'You' : partnerName}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Checked items */}
            {checkedItems.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed ({checkedItems.length})</h3>
                  <button className="text-xs text-red-500 font-medium">Clear completed</button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                  {checkedItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3 opacity-50">
                      <button onClick={() => toggleShopItem(item.id)} className="w-5 h-5 rounded-md bg-green-500 border-2 border-green-500 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </button>
                      <span className="text-sm text-gray-400 line-through flex-1">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ============ MEALS TAB ============ */}
        {activeTab === 'meals' && (
          <>
            <h2 className="text-xl font-bold text-gray-900">This Week's Meals</h2>
            <div className="space-y-2">
              {mealPlan.map(day => (
                <div key={day.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase">{day.date}</span>
                    <span className="text-[10px] text-orange-500 font-medium">{day.meal_slot}</span>
                  </div>
                  {day.recipe ? (
                    <div className="mt-1.5">
                      <p className="text-sm font-semibold text-gray-900">{day.recipe.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">⏱️ {day.recipe.time} min</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          day.recipe.difficulty === 'easy' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                        }`}>{day.recipe.difficulty}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mt-1">No meal planned — ask Flatmate!</p>
                  )}
                </div>
              ))}
            </div>

            <h3 className="text-base font-semibold text-gray-900 mt-6">Trending Recipes 🔥</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
              {[
                { title: 'Thai Green Curry', time: 25, rating: 4.7 },
                { title: 'Creamy Tuscan Shrimp', time: 20, rating: 4.8 },
                { title: 'Mushroom Risotto', time: 40, rating: 4.6 },
                { title: 'Fish Tacos', time: 25, rating: 4.4 },
              ].map((r, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 min-w-[160px] shrink-0">
                  <div className="w-full h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-3xl mb-2">
                    {['🍛', '🦐', '🍄', '🌮'][i]}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">⏱️ {r.time}m</span>
                    <span className="text-xs text-gray-500">⭐ {r.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ============ CHORES TAB ============ */}
        {activeTab === 'chores' && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Chores</h2>
              <div className="flex items-center gap-2">
                <div className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">{completedChores.length} done</div>
                <div className="bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">{remainingChores.length} remaining</div>
              </div>
            </div>

            {/* Points */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-500">Your points</p>
                <p className="text-2xl font-bold text-orange-500">{completedChores.reduce((sum, c) => sum + c.points, 0)}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-500">{partnerName}'s points</p>
                <p className="text-2xl font-bold text-gray-400">0</p>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['All', 'Today', 'Mine'].map((tab, i) => (
                <button key={tab} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  i === 0 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{tab}</button>
              ))}
            </div>

            {/* Chore list */}
            <div className="space-y-2">
              {allChores.filter(c => c.is_completed).map(ch => (
                <div key={ch.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 opacity-60">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleChore(ch.id)} className="w-5 h-5 rounded-md bg-green-500 border-2 border-green-500 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <span className="text-sm line-through text-gray-400 flex-1">{ch.title}</span>
                    {ch.completed_by && <span className="text-[10px] text-gray-400">by {ch.completed_by === user.id ? 'you' : partnerName}</span>}
                  </div>
                </div>
              ))}
              {allChores.filter(c => !c.is_completed).map(ch => (
                <div key={ch.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleChore(ch.id)} className="w-5 h-5 rounded-md border-2 border-gray-300 hover:border-orange-400 shrink-0 transition-colors"></button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{ch.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400">{ch.room}</span>
                        <span className="text-[10px] text-gray-300">·</span>
                        <span className="text-[10px] text-gray-400">{ch.estimated_minutes}m</span>
                        <span className="text-[10px] text-gray-300">·</span>
                        <span className="text-[10px] text-orange-500 font-medium">{ch.points} pts</span>
                      </div>
                    </div>
                    {ch.assigned_to && <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">{ch.assigned_to === user.id ? 'You' : partnerName}</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ============ CALENDAR TAB ============ */}
        {activeTab === 'calendar' && (
          <>
            <h2 className="text-xl font-bold text-gray-900">Today's Calendar</h2>
            <div className="space-y-2">
              {todayEvents.map(ev => (
                <div key={ev.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-10 rounded-full shrink-0 ${
                      ev.category === 'health' ? 'bg-green-500' : ev.category === 'work' ? 'bg-blue-500' : ev.category === 'shared' ? 'bg-orange-500' : 'bg-purple-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{ev.title}</p>
                      <p className="text-xs text-gray-500">{ev.time}</p>
                    </div>
                    {ev.for_user && <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">{ev.for_user === user.id ? 'You' : partnerName}</span>}
                    {!ev.for_user && <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">Both</span>}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">Full calendar view coming soon</p>
          </>
        )}

        {/* ============ MONEY TAB ============ */}
        {activeTab === 'money' && (
          <>
            <h2 className="text-xl font-bold text-gray-900">Money & Bills</h2>
            
            {/* Balance */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 text-center border border-green-100">
              <p className="text-sm text-green-700">You owe / are owed</p>
              <p className="text-3xl font-bold text-green-600 mt-1">£0.00</p>
              <p className="text-sm text-green-600 mt-1">All settled up! 🎉</p>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: '💸', label: 'Add Expense' },
                { icon: '🤝', label: 'Settle Up' },
                { icon: '📷', label: 'Scan Receipt' },
                { icon: '🎯', label: 'Savings' },
              ].map(a => (
                <button key={a.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 text-center hover:bg-gray-50 transition-colors">
                  <span className="text-xl">{a.icon}</span>
                  <p className="text-[10px] text-gray-600 mt-1 font-medium">{a.label}</p>
                </button>
              ))}
            </div>

            {/* Upcoming bills */}
            <h3 className="text-base font-semibold text-gray-900">Upcoming Bills</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
              {upcomingBills.map(bill => (
                <div key={bill.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-lg">{bill.is_paid ? '✅' : '💰'}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${bill.is_paid ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{bill.title}</p>
                    <p className="text-xs text-gray-400">Due {bill.due} · {bill.frequency}</p>
                  </div>
                  <span className={`text-sm font-semibold ${bill.is_paid ? 'text-green-500' : 'text-gray-900'}`}>£{bill.amount}</span>
                </div>
              ))}
            </div>

            {/* Recent expenses */}
            <h3 className="text-base font-semibold text-gray-900">Recent Expenses</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
              {recentExpenses.map(exp => (
                <div key={exp.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-lg">{exp.category === 'groceries' ? '🛒' : exp.category === 'dining' ? '🍽️' : exp.category === 'transport' ? '🚗' : '🏠'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{exp.title}</p>
                    <p className="text-xs text-gray-400">Paid by {exp.paid_by === user.id ? 'you' : partnerName} · {exp.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">£{exp.amount}</span>
                </div>
              ))}
            </div>

            {/* Savings goals */}
            <h3 className="text-base font-semibold text-gray-900">Savings Goals</h3>
            <div className="space-y-2">
              {savingsGoals.map(goal => (
                <div key={goal.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                    <p className="text-sm font-semibold text-orange-500">{goal.currency}{goal.current} / {goal.currency}{goal.target}</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(goal.current / goal.target) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ============ MORE TAB ============ */}
        {activeTab === 'more' && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">More</h2>
            <div className="space-y-2">
              {[
                { icon: '🛒', title: 'Pantry Tracker', desc: 'Track what\'s in your fridge & cupboards', badge: `${plants.length} plants, ${pets.length} pet` },
                { icon: '📝', title: 'Notes & Documents', desc: 'Shared notes and secure document vault', badge: `${notes.length} notes` },
                { icon: '🐾', title: 'Pet Care', desc: 'Feeding, walks & vet visits for Luna', badge: null },
                { icon: '🌿', title: 'Plant Care', desc: `${plants.filter(p => p.is_overdue).length} need watering today`, badge: null },
                { icon: '🎯', title: 'Habits & Goals', desc: `${habits.filter(h => checkedHabits.includes(h.id)).length}/${habits.length} done today`, badge: null },
                { icon: '📦', title: 'Packages & Errands', desc: `${packages.filter(p => p.status === 'out_for_delivery').length} out for delivery`, badge: null },
                { icon: '🤖', title: 'Flatmate AI', desc: 'Your intelligent home assistant', badge: null },
              ].map(item => (
                <div key={item.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  {item.badge && <span className="text-[10px] bg-orange-50 text-orange-600 font-medium px-2 py-0.5 rounded-full">{item.badge}</span>}
                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Demo Banner */}
      <div className="fixed bottom-0 inset-x-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-2 text-xs font-medium z-50">
        🎉 Demo mode — data is interactive but not persisted · <a href="/" className="underline">Back to homepage</a>
      </div>
    </div>
  );
}
