'use client';
import { useDemoAuth, DEMO_USER, DEMO_PARTNER } from '@/hooks/useDemoAuth';
import { shoppingLists, todayChores, allChores, mealPlan, todayEvents, upcomingBills, recentExpenses, packages, partnerActivity, plants, pets, habits, notes, savingsGoals } from '@/lib/demo-data';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const TAB_CONFIG = [
  { id: 'home' as const, label: 'Home', emoji: '🏠' },
  { id: 'shopping' as const, label: 'Shop', emoji: '🛒' },
  { id: 'meals' as const, label: 'Meals', emoji: '🍽️' },
  { id: 'chores' as const, label: 'Chores', emoji: '✅' },
  { id: 'money' as const, label: 'Money', emoji: '💰' },
  { id: 'more' as const, label: 'More', emoji: '⚙️' },
];

type TabId = 'home' | 'shopping' | 'meals' | 'chores' | 'money' | 'more';

function ProgressRing({ progress, size = 48, strokeWidth = 4, color = 'rgb(249, 115, 22)' }: { progress: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f3f4f6" strokeWidth={strokeWidth} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700 ease-out" />
    </svg>
  );
}

function CheckIcon({ checked }: { checked: boolean }) {
  return checked ? (
    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
  ) : null;
}

export default function DashboardPage() {
  const { user, household } = useDemoAuth();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [displayTab, setDisplayTab] = useState<TabId>('home');
  const [transitioning, setTransitioning] = useState(false);
  const [shoppingItems, setShoppingItems] = useState(shoppingLists[0].items);
  const [chores, setChores] = useState(allChores);
  const [checkedHabits, setCheckedHabits] = useState<string[]>(['hab-1', 'hab-4']);
  const [newItem, setNewItem] = useState('');
  const [addingItem, setAddingItem] = useState(false);
  const newItemRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const switchTab = (tab: TabId) => {
    if (tab === activeTab) return;
    setTransitioning(true);
    setTimeout(() => {
      setDisplayTab(tab);
      setActiveTab(tab);
      setTransitioning(false);
      contentRef.current?.scrollTo?.({ top: 0 });
    }, 150);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const greetingEmoji = hour < 12 ? '☀️' : hour < 18 ? '🌤️' : '🌙';
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

  const addNewItem = () => {
    if (!newItem.trim()) return;
    const id = `si-new-${Date.now()}`;
    setShoppingItems(prev => [...prev, { id, name: newItem.trim(), quantity: 1, unit: null, category: 'other', checked: false, priority: false, assigned_to: null }]);
    setNewItem('');
    setAddingItem(false);
  };

  const userName = user.display_name;
  const partnerName = household.partner?.display_name ?? 'Partner';
  const uncheckedItems = shoppingItems.filter(i => !i.checked);
  const checkedItems = shoppingItems.filter(i => i.checked);
  const remainingChores = chores.filter(c => !c.is_completed);
  const completedChores = chores.filter(c => c.is_completed);
  const choreProgress = Math.round((completedChores.length / chores.length) * 100);
  const chorePoints = completedChores.reduce((sum, c) => sum + c.points, 0);

  const shoppingBadge = uncheckedItems.length;
  const choreBadge = remainingChores.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes checkPop { 0%{transform:scale(0.8);opacity:0.5} 50%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes strikethrough { from{background-size:0% 100%} to{background-size:100% 100%} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-8px)} }
        @keyframes fadeScale { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .anim-check { animation: checkPop 0.3s ease-out; }
        .anim-slide-up { animation: slideUp 0.4s ease-out both; }
        .anim-fade-scale { animation: fadeScale 0.3s ease-out both; }
        .stagger-1 { animation-delay: 0.05s; }
        .stagger-2 { animation-delay: 0.1s; }
        .stagger-3 { animation-delay: 0.15s; }
        .stagger-4 { animation-delay: 0.2s; }
        .stagger-5 { animation-delay: 0.25s; }
        .stagger-6 { animation-delay: 0.3s; }
        .stagger-7 { animation-delay: 0.35s; }
        .stagger-8 { animation-delay: 0.4s; }
        .checked-text { text-decoration: line-through; text-decoration-color: rgb(156,163,175); }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
        .tab-content-enter { animation: slideUp 0.35s ease-out both; }
        .tab-content-exit { animation: slideDown 0.15s ease-in both; }
        .progress-bar-animated { transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
        .fab-shadow { box-shadow: 0 4px 20px rgba(249,115,22,0.4); }
      `}} />

      <header className="bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative mx-auto max-w-2xl px-5 pt-14 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{greetingEmoji}</span>
                <p className="text-orange-100 text-sm font-medium">{today}</p>
              </div>
              <h1 className="text-2xl font-bold mt-1">{greeting}, {userName}</h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                  ☀️ 18°C Partly cloudy
                </span>
                <span className="text-xs text-orange-200 flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400"></span></span>
                  {partnerName} online
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm font-bold ring-2 ring-white/30">
              {userName[0]}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2">
            {[
              { tab: 'shopping' as TabId, emoji: '🛒', label: 'Add Item', badge: shoppingBadge },
              { tab: 'chores' as TabId, emoji: '✅', label: 'Log Chore', badge: choreBadge },
              { tab: 'meals' as TabId, emoji: '🍽️', label: 'Dinner?', badge: undefined },
              { tab: 'more' as TabId, emoji: '🤖', label: 'Flatmate', badge: undefined },
            ].map((action) => (
              <button key={action.tab} onClick={() => switchTab(action.tab)}
                className="relative flex flex-col items-center gap-1 rounded-xl bg-white/15 p-3 backdrop-blur-sm hover:bg-white/25 active:scale-95 transition-all">
                <span className="text-xl">{action.emoji}</span>
                <span className="text-[10px] font-medium text-orange-100">{action.label}</span>
                {action.badge !== undefined && action.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-orange-600 text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">{action.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-2xl flex overflow-x-auto no-scrollbar">
          {TAB_CONFIG.map(tab => (
            <button key={tab.id} onClick={() => switchTab(tab.id)}
              className={`relative flex-1 min-w-[56px] py-3 px-2 text-center text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'
              }`}>
              <span className="mr-1">{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.id === 'shopping' && shoppingBadge > 0 && (
                <span className="absolute top-1.5 right-1/4 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{shoppingBadge}</span>
              )}
              {tab.id === 'chores' && choreBadge > 0 && (
                <span className="absolute top-1.5 right-1/4 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{choreBadge}</span>
              )}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 py-4 pb-20" ref={contentRef}>
        <div className={`transition-all duration-150 ${transitioning ? 'tab-content-exit' : 'tab-content-enter'}`}>

          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Progress Overview */}
              <div className="grid grid-cols-2 gap-3 anim-slide-up stagger-1">
                <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100 card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Chores done</p>
                      <p className="text-2xl font-bold text-gray-900 mt-0.5">{completedChores.length}<span className="text-sm font-normal text-gray-400">/{chores.length}</span></p>
                    </div>
                    <ProgressRing progress={choreProgress} size={44} />
                  </div>
                  <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-1.5 rounded-full progress-bar-animated" style={{ width: `${choreProgress}%` }} />
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100 card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Shopping left</p>
                      <p className="text-2xl font-bold text-gray-900 mt-0.5">{uncheckedItems.length}<span className="text-sm font-normal text-gray-400">/{shoppingItems.length}</span></p>
                    </div>
                    <ProgressRing progress={Math.round((checkedItems.length / shoppingItems.length) * 100)} size={44} color="rgb(16, 185, 129)" />
                  </div>
                  <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full progress-bar-animated" style={{ width: `${Math.round((checkedItems.length / shoppingItems.length) * 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* Today's Schedule */}
              <section className="anim-slide-up stagger-2">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  📅 Today's Schedule
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full normal-case tracking-normal">{todayEvents.length} events</span>
                </h2>
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 divide-y divide-gray-50 overflow-hidden">
                  {todayEvents.map(ev => (
                    <div key={ev.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                      <div className={`w-1 h-8 rounded-full shrink-0 ${
                        ev.category === 'health' ? 'bg-green-400' : ev.category === 'work' ? 'bg-blue-400' : ev.category === 'shared' ? 'bg-orange-400' : 'bg-purple-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium">{ev.title}</p>
                        <p className="text-xs text-gray-500">{ev.time}</p>
                      </div>
                      {ev.for_user ? (
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{ev.for_user === user.id ? 'You' : partnerName}</span>
                      ) : (
                        <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-semibold">Both</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Chores Quick View */}
              <section className="anim-slide-up stagger-3">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    ✅ Chores
                    <span className="text-[10px] bg-orange-50 text-orange-600 font-semibold px-2 py-0.5 rounded-full normal-case tracking-normal">{remainingChores.length} left</span>
                  </h2>
                  <button onClick={() => switchTab('chores')} className="text-xs text-orange-600 font-semibold hover:text-orange-700 transition-colors">See all →</button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 divide-y divide-gray-50 overflow-hidden">
                  {chores.slice(0, 4).map((ch, i) => (
                    <div key={ch.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                      <button onClick={() => toggleChore(ch.id)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                          ch.is_completed ? 'bg-green-500 border-green-500 anim-check' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                        }`}>
                        <CheckIcon checked={ch.is_completed} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm transition-all duration-300 ${ch.is_completed ? 'line-through text-gray-400' : 'text-gray-900 font-medium'}`}>{ch.title}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-gray-400">{ch.room}</span>
                          <span className="text-[10px] text-gray-300">·</span>
                          <span className="text-[10px] text-gray-400">{ch.estimated_minutes}m</span>
                        </div>
                      </div>
                      {ch.assigned_to && (
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          ch.assigned_to === user.id ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                        }`}>{ch.assigned_to === user.id ? 'You' : partnerName}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Shopping Quick View */}
              <section className="anim-slide-up stagger-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    🛒 Shopping
                    <span className="text-[10px] bg-green-50 text-green-600 font-semibold px-2 py-0.5 rounded-full normal-case tracking-normal">{uncheckedItems.length} items</span>
                  </h2>
                  <button onClick={() => switchTab('shopping')} className="text-xs text-orange-600 font-semibold hover:text-orange-700 transition-colors">See all →</button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 divide-y divide-gray-50 overflow-hidden">
                  {shoppingItems.slice(0, 5).map((item, i) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/50 transition-colors">
                      <button onClick={() => toggleShopItem(item.id)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                          item.checked ? 'bg-green-500 border-green-500 anim-check' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                        }`}>
                        <CheckIcon checked={item.checked} />
                      </button>
                      <span className={`text-sm flex-1 transition-all duration-300 ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>{item.name}</span>
                      {item.quantity > 1 && <span className="text-xs text-gray-400">{item.quantity} {item.unit}</span>}
                      {item.priority && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">!</span>}
                    </div>
                  ))}
                </div>
              </section>

              {/* Dinner Tonight */}
              <section className="anim-slide-up stagger-5">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  🍽️ Dinner Tonight
                </h2>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 ring-1 ring-orange-100/50 card-hover">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">🍛</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">Thai Green Curry</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">⏱️ 25 min</span>
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">Easy</span>
                        <span className="text-xs text-orange-600 font-medium">For two</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 active:scale-95 transition-all shadow-sm shadow-orange-200">
                      Cook
                    </button>
                  </div>
                </div>
              </section>

              {/* Coming Up */}
              {(upcomingBills.filter(b => !b.is_paid).length > 0 || packages.filter(p => p.status !== 'delivered').length > 0) && (
                <section className="anim-slide-up stagger-6">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">📋 Coming Up</h2>
                  <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 divide-y divide-gray-50 overflow-hidden">
                    {upcomingBills.filter(b => !b.is_paid).slice(0, 2).map(bill => (
                      <div key={bill.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-base">💰</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{bill.title}</p>
                          <p className="text-xs text-gray-500">Due {bill.due}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-900">£{bill.amount}</span>
                      </div>
                    ))}
                    {packages.filter(p => p.status !== 'delivered').slice(0, 2).map(pkg => (
                      <div key={pkg.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base">📦</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{pkg.title}</p>
                          <p className="text-xs text-gray-500">{pkg.carrier} · {pkg.expected}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                          pkg.status === 'out_for_delivery' ? 'bg-green-50 text-green-700 ring-1 ring-green-200/50' : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200/50'
                        }`}>{pkg.status === 'out_for_delivery' ? '🚚 Out for delivery' : pkg.status === 'shipped' ? '📦 Shipped' : '⏳ Pending'}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Partner Activity */}
              <section className="anim-slide-up stagger-7">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  {partnerName}'s Activity
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                </h2>
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
                  {partnerActivity.map((act, i) => (
                    <div key={act.id} className={`flex items-center gap-3 px-4 py-3 ${i < partnerActivity.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-colors`}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-bold text-blue-600 ring-1 ring-blue-100">
                        {partnerName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="text-gray-500">{act.action}</span> <span className="font-medium">{act.item}</span>
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{act.time}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Savings Goals */}
              <section className="anim-slide-up stagger-8">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">🎯 Savings Goals</h2>
                <div className="space-y-2">
                  {savingsGoals.map(goal => {
                    const pct = Math.round((goal.current / goal.target) * 100);
                    return (
                      <div key={goal.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 card-hover">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-gray-900">{goal.title}</p>
                          <p className="text-xs font-semibold text-orange-600">{pct}%</p>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-2 rounded-full progress-bar-animated" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">{goal.currency}{goal.current} of {goal.currency}{goal.target}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'shopping' && (
            <div className="space-y-4 anim-slide-up">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Shopping Lists</h2>
                <div className="flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full">{uncheckedItems.length} remaining</span>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {shoppingLists.map(list => (
                  <button key={list.id} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    list.id === 'list-1' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                    {list.icon} {list.name}
                  </button>
                ))}
              </div>

              {/* Add item input */}
              {addingItem ? (
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-orange-200 p-3 flex items-center gap-2 anim-fade-scale">
                  <input
                    ref={newItemRef}
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addNewItem()}
                    placeholder="e.g. Avocados"
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                    autoFocus
                  />
                  <button onClick={addNewItem} className="px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 active:scale-95 transition-all">Add</button>
                  <button onClick={() => { setAddingItem(false); setNewItem(''); }} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-all">Cancel</button>
                </div>
              ) : (
                <button onClick={() => { setAddingItem(true); setTimeout(() => newItemRef.current?.focus(), 100); }}
                  className="w-full bg-white rounded-2xl shadow-sm ring-1 ring-dashed ring-gray-200 p-3 flex items-center justify-center gap-2 text-gray-400 hover:text-orange-500 hover:ring-orange-300 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  <span className="text-sm font-medium">Add item</span>
                </button>
              )}

              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">To buy</h3>
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 divide-y divide-gray-50 overflow-hidden">
                  {uncheckedItems.map((item, i) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors" style={{ animationDelay: `${i * 0.03}s` }}>
                      <button onClick={() => toggleShopItem(item.id)}
                        className="w-5 h-5 rounded-md border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50 shrink-0 transition-all duration-200 flex items-center justify-center" />
                      <span className="text-sm text-gray-900 flex-1 font-medium">{item.name}</span>
                      {item.quantity > 1 && <span className="text-xs text-gray-400">{item.quantity} {item.unit}</span>}
                      {item.priority && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Priority</span>}
                      {item.assigned_to && <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">{item.assigned_to === user.id ? 'You' : partnerName}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {checkedItems.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed ({checkedItems.length})</h3>
                    <button onClick={() => setShoppingItems(prev => prev.filter(i => !i.checked))} className="text-xs text-red-500 font-medium hover:text-red-600 transition-colors">Clear completed</button>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 divide-y divide-gray-50 overflow-hidden">
                    {checkedItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 px-4 py-3 opacity-50">
                        <button onClick={() => toggleShopItem(item.id)}
                          className="w-5 h-5 rounded-md bg-green-500 border-2 border-green-500 flex items-center justify-center shrink-0 anim-check">
                          <CheckIcon checked />
                        </button>
                        <span className="text-sm text-gray-400 line-through flex-1">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'meals' && (
            <div className="space-y-4 anim-slide-up">
              <h2 className="text-xl font-bold text-gray-900">This Week's Meals</h2>
              <div className="space-y-2">
                {mealPlan.map(day => (
                  <div key={day.id} className={`bg-white rounded-2xl shadow-sm ring-1 p-4 transition-all duration-200 hover:shadow-md ${day.recipe ? 'ring-orange-100' : 'ring-gray-100'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{day.date}</span>
                      {day.recipe && <span className="text-[10px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{day.meal_slot}</span>}
                    </div>
                    {day.recipe ? (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center text-lg">
                          {day.recipe.title.includes('Curry') ? '🍛' : day.recipe.title.includes('Pasta') ? '🍝' : day.recipe.title.includes('Salmon') ? '🐟' : day.recipe.title.includes('Pizza') ? '🍕' : '🍽️'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{day.recipe.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">⏱️ {day.recipe.time} min</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              day.recipe.difficulty === 'easy' ? 'bg-green-50 text-green-700 ring-1 ring-green-200/50' : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200/50'
                            }`}>{day.recipe.difficulty}</span>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-semibold rounded-lg hover:bg-orange-100 active:scale-95 transition-all">
                          Cook
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">🤔</div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-400">No meal planned</p>
                          <p className="text-xs text-orange-500 font-medium">Ask Flatmate for a suggestion</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <h3 className="text-base font-semibold text-gray-900 mt-6 flex items-center gap-2">
                Trending Recipes
                <span className="text-base">🔥</span>
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
                {[
                  { title: 'Thai Green Curry', time: 25, rating: 4.7, emoji: '🍛', diff: 'Easy' },
                  { title: 'Creamy Tuscan Shrimp', time: 20, rating: 4.8, emoji: '🦐', diff: 'Easy' },
                  { title: 'Mushroom Risotto', time: 40, rating: 4.6, emoji: '🍄', diff: 'Medium' },
                  { title: 'Fish Tacos', time: 25, rating: 4.4, emoji: '🌮', diff: 'Easy' },
                ].map((r, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 min-w-[170px] shrink-0 card-hover">
                    <div className="w-full h-20 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl flex items-center justify-center text-3xl mb-2">{r.emoji}</div>
                    <p className="text-sm font-bold text-gray-900">{r.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">⏱️ {r.time}m</span>
                      <span className="text-xs text-amber-500">⭐ {r.rating}</span>
                    </div>
                    <span className="inline-block mt-1.5 text-[10px] font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{r.diff}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chores' && (
            <div className="space-y-4 anim-slide-up">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Chores</h2>
                <div className="flex items-center gap-2">
                  <div className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-green-200/50">{completedChores.length} done</div>
                  <div className="bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-orange-200/50">{remainingChores.length} remaining</div>
                </div>
              </div>

              {/* Points + Streak */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 text-center card-hover">
                  <p className="text-xs text-gray-500 font-medium">Your points</p>
                  <p className="text-2xl font-bold text-orange-500 mt-0.5">{chorePoints}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 text-center card-hover">
                  <p className="text-xs text-gray-500 font-medium">{partnerName}'s points</p>
                  <p className="text-2xl font-bold text-gray-300 mt-0.5">0</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-sm ring-1 ring-orange-100/50 p-4 text-center">
                  <p className="text-xs text-orange-700 font-medium">Day streak</p>
                  <p className="text-2xl font-bold text-orange-500 mt-0.5">7🔥</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Today's progress</span>
                  <span className="text-xs font-bold text-orange-600">{choreProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-2.5 rounded-full progress-bar-animated" style={{ width: `${choreProgress}%` }} />
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {['All', 'Today', 'Mine'].map((tab, i) => (
                  <button key={tab} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    i === 0 ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>{tab}</button>
                ))}
              </div>

              {/* Chore list */}
              <div className="space-y-2">
                {chores.filter(c => c.is_completed).map(ch => (
                  <div key={ch.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 px-4 py-3 opacity-60 hover:opacity-80 transition-opacity">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleChore(ch.id)} className="w-5 h-5 rounded-md bg-green-500 border-2 border-green-500 flex items-center justify-center shrink-0 anim-check">
                        <CheckIcon checked />
                      </button>
                      <span className="text-sm line-through text-gray-400 flex-1">{ch.title}</span>
                      {ch.completed_by && <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">by {ch.completed_by === user.id ? 'you' : partnerName}</span>}
                    </div>
                  </div>
                ))}
                {chores.filter(c => !c.is_completed).map((ch, i) => (
                  <div key={ch.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 px-4 py-3 card-hover">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleChore(ch.id)} className="w-5 h-5 rounded-md border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50 shrink-0 transition-all duration-200" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{ch.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{ch.room}</span>
                          <span className="text-[10px] text-gray-400">{ch.estimated_minutes}m</span>
                          <span className="text-[10px] text-orange-500 font-medium">{ch.points} pts</span>
                        </div>
                      </div>
                      {ch.assigned_to && <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        ch.assigned_to === user.id ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200/50' : 'bg-blue-50 text-blue-600 ring-1 ring-blue-200/50'
                      }`}>{ch.assigned_to === user.id ? 'You' : partnerName}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'money' && (
            <div className="space-y-4 anim-slide-up">
              <h2 className="text-xl font-bold text-gray-900">Money & Bills</h2>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 text-center ring-1 ring-green-200/50">
                <p className="text-sm text-green-700 font-medium">You owe / are owed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">£0.00</p>
                <p className="text-sm text-green-600 mt-1">All settled up! 🎉</p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: '💸', label: 'Add Expense' },
                  { icon: '🤝', label: 'Settle Up' },
                  { icon: '📷', label: 'Scan Receipt' },
                  { icon: '🎯', label: 'Savings' },
                ].map(a => (
                  <button key={a.label} className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-3 text-center hover:shadow-md hover:ring-orange-200 active:scale-95 transition-all">
                    <span className="text-xl">{a.icon}</span>
                    <p className="text-[10px] text-gray-600 mt-1 font-medium">{a.label}</p>
                  </button>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Upcoming Bills</h3>
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 divide-y divide-gray-50 overflow-hidden">
                {upcomingBills.map(bill => (
                  <div key={bill.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${bill.is_paid ? 'bg-green-50' : 'bg-amber-50'}`}>
                      {bill.is_paid ? '✅' : '💰'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${bill.is_paid ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{bill.title}</p>
                      <p className="text-xs text-gray-400">Due {bill.due} · {bill.frequency}</p>
                    </div>
                    <span className={`text-sm font-bold ${bill.is_paid ? 'text-green-600' : 'text-gray-900'}`}>£{bill.amount}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recent Expenses</h3>
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 divide-y divide-gray-50 overflow-hidden">
                {recentExpenses.map(exp => (
                  <div key={exp.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-base">
                      {exp.category === 'groceries' ? '🛒' : exp.category === 'dining' ? '🍽️' : exp.category === 'transport' ? '🚗' : '🏠'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{exp.title}</p>
                      <p className="text-xs text-gray-400">Paid by {exp.paid_by === user.id ? 'you' : partnerName} · {exp.date}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">£{exp.amount}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Savings Goals</h3>
              <div className="space-y-2">
                {savingsGoals.map(goal => {
                  const pct = Math.round((goal.current / goal.target) * 100);
                  return (
                    <div key={goal.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 card-hover">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900">{goal.title}</p>
                        <p className="text-xs font-semibold text-orange-600">{pct}%</p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-2.5 rounded-full progress-bar-animated" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">{goal.currency}{goal.current} of {goal.currency}{goal.target}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'more' && (
            <div className="space-y-4 anim-slide-up">
              <h2 className="text-xl font-bold text-gray-900">More</h2>
              <div className="space-y-2">
                {[
                  { icon: '🌿', title: 'Plant Care', desc: `${plants.filter(p => p.is_overdue).length} need watering today`, badge: `${plants.length} plants`, color: 'from-green-50 to-emerald-50' },
                  { icon: '📝', title: 'Notes & Documents', desc: 'Shared notes and secure document vault', badge: `${notes.length} notes`, color: 'from-purple-50 to-violet-50' },
                  { icon: '🐾', title: 'Pet Care', desc: 'Feeding, walks & vet visits for Luna', badge: null, color: 'from-amber-50 to-yellow-50' },
                  { icon: '🎯', title: 'Habits & Goals', desc: `${checkedHabits.length}/${habits.length} done today`, badge: null, color: 'from-blue-50 to-cyan-50' },
                  { icon: '📦', title: 'Packages & Errands', desc: `${packages.filter(p => p.status === 'out_for_delivery').length} out for delivery`, badge: null, color: 'from-orange-50 to-red-50' },
                  { icon: '🤖', title: 'Flatmate AI', desc: 'Your intelligent home assistant', badge: 'New', color: 'from-gray-50 to-slate-50' },
                ].map(item => (
                  <div key={item.title} className={`bg-gradient-to-r ${item.color} rounded-2xl ring-1 ring-gray-100/50 px-4 py-3 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]`}>
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    {item.badge && <span className="text-[10px] bg-white/80 text-orange-600 font-semibold px-2 py-0.5 rounded-full ring-1 ring-orange-200/50">{item.badge}</span>}
                    <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                ))}
              </div>

              {/* Plant Watering Status */}
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">🌱 Plant Status</h3>
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 divide-y divide-gray-50 overflow-hidden">
                {plants.map(plant => (
                  <div key={plant.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-lg">{plant.is_overdue ? '🚨' : '🌿'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{plant.name}</p>
                      <p className="text-xs text-gray-500">{plant.location} · Last watered {plant.last_watered}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                      plant.is_overdue ? 'bg-red-50 text-red-700 ring-1 ring-red-200/50' : 'bg-green-50 text-green-700 ring-1 ring-green-200/50'
                    }`}>{plant.is_overdue ? 'Needs water!' : `${plant.next_watering}`}</span>
                  </div>
                ))}
              </div>

              {/* Habits */}
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">🎯 Habits</h3>
              <div className="space-y-2">
                {habits.map(habit => {
                  const isChecked = checkedHabits.includes(habit.id);
                  return (
                    <div key={habit.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 flex items-center gap-3 card-hover">
                      <button onClick={() => toggleHabit(habit.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isChecked ? 'bg-green-500 border-green-500 anim-check' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                        }`}>
                        {isChecked && <CheckIcon checked />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium transition-all duration-300 ${isChecked ? 'line-through text-gray-400' : 'text-gray-900'}`}>{habit.title}</p>
                        <p className="text-xs text-gray-400">{habit.frequency}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-orange-500">🔥 {habit.streak}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Package Timeline */}
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">📦 Package Timeline</h3>
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4">
                <div className="space-y-4">
                  {packages.map((pkg, i) => (
                    <div key={pkg.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          pkg.status === 'delivered' ? 'bg-green-100 text-green-600' : pkg.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-600' : pkg.status === 'shipped' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {pkg.status === 'delivered' ? '✓' : pkg.status === 'out_for_delivery' ? '🚚' : pkg.status === 'shipped' ? '📦' : '🕐'}
                        </div>
                        {i < packages.length - 1 && <div className="w-px h-6 bg-gray-200 mt-1" />}
                      </div>
                      <div className="flex-1 min-w-0 pb-1">
                        <p className="text-sm font-medium text-gray-900">{pkg.title}</p>
                        <p className="text-xs text-gray-500">{pkg.carrier} · Expected {pkg.expected}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                        pkg.status === 'out_for_delivery' ? 'bg-green-50 text-green-700 ring-1 ring-green-200/50' : pkg.status === 'shipped' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50' : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200/50'
                      }`}>{pkg.status === 'out_for_delivery' ? '🚚 Out for delivery' : pkg.status === 'shipped' ? '📦 Shipped' : '⏳ Pending'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
        <div className="mx-auto max-w-2xl flex">
          {[
            { id: 'home' as TabId, label: 'Home', emoji: '🏠', badge: undefined },
            { id: 'shopping' as TabId, label: 'Shop', emoji: '🛒', badge: shoppingBadge > 0 ? shoppingBadge : undefined },
            { id: 'meals' as TabId, label: 'Meals', emoji: '🍽️', badge: undefined },
            { id: 'chores' as TabId, label: 'Chores', emoji: '✅', badge: choreBadge > 0 ? choreBadge : undefined },
            { id: 'money' as TabId, label: 'Money', emoji: '💰', badge: undefined },
          ].map(navItem => (
            <button key={navItem.id} onClick={() => switchTab(navItem.id)}
              className={`relative flex-1 flex flex-col items-center py-2 pt-2.5 transition-all duration-200 ${
                activeTab === navItem.id ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'
              }`}>
              <span className="text-lg relative">
                {navItem.emoji}
                {navItem.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-orange-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{navItem.badge}</span>
                )}
              </span>
              <span className={`text-[10px] font-medium mt-0.5 ${activeTab === navItem.id ? 'text-orange-600' : ''}`}>{navItem.label}</span>
              {activeTab === navItem.id && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-orange-500 rounded-full" />}
            </button>
          ))}
        </div>
      </nav>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-20">
        <button
          onClick={() => switchTab('shopping')}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl fab-shadow flex items-center justify-center active:scale-90 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      {/* Demo Banner */}
      <div className="fixed bottom-14 inset-x-0 z-10 pointer-events-none">
        <div className="mx-auto max-w-lg px-4">
          <div className="bg-gray-900/80 backdrop-blur-sm text-white text-center py-1.5 px-4 rounded-full text-[10px] font-medium">
            Demo mode — data is interactive but not persisted · <a href="/" className="underline pointer-events-auto">Homepage</a>
          </div>
        </div>
      </div>
    </div>
  );
}