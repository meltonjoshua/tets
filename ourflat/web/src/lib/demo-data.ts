export const shoppingLists = [
  {
    id: 'list-1',
    name: 'Weekly Groceries',
    icon: '🛒',
    items: [
      { id: 'si-1', name: 'Whole milk', quantity: 2, unit: 'pints', category: 'dairy', checked: false, priority: false, assigned_to: null },
      { id: 'si-2', name: 'Free-range eggs', quantity: 1, unit: 'dozen', category: 'dairy', checked: false, priority: true, assigned_to: 'demo-user-1' },
      { id: 'si-3', name: 'Sourdough bread', quantity: 1, unit: null, category: 'bakery', checked: false, priority: false, assigned_to: null },
      { id: 'si-4', name: 'Chicken breast', quantity: 500, unit: 'g', category: 'meat_fish', checked: true, priority: false, assigned_to: 'demo-user-2' },
      { id: 'si-5', name: 'Thai green curry paste', quantity: 1, unit: null, category: 'other', checked: false, priority: false, assigned_to: null },
      { id: 'si-6', name: 'Coconut milk', quantity: 2, unit: 'cans', category: 'other', checked: false, priority: false, assigned_to: null },
      { id: 'si-7', name: 'Jasmine rice', quantity: 1, unit: 'kg', category: 'other', checked: false, priority: false, assigned_to: null },
      { id: 'si-8', name: 'Broccoli', quantity: 2, unit: null, category: 'fruit_veg', checked: false, priority: false, assigned_to: null },
      { id: 'si-9', name: 'Butter', quantity: 1, unit: null, category: 'dairy', checked: true, priority: false, assigned_to: 'demo-user-1' },
      { id: 'si-10', name: 'Toilet roll', quantity: 1, unit: 'pack of 9', category: 'household', checked: false, priority: true, assigned_to: null },
    ],
  },
  {
    id: 'list-2',
    name: 'Costco Run',
    icon: '📦',
    items: [
      { id: 'si-11', name: 'Dishwasher tablets', quantity: 1, unit: 'box of 90', category: 'household', checked: false, priority: false, assigned_to: null },
      { id: 'si-12', name: 'Olive oil', quantity: 2, unit: 'L', category: 'other', checked: false, priority: false, assigned_to: null },
      { id: 'si-13', name: 'Coffee beans', quantity: 1, unit: 'kg', category: 'drinks', checked: false, priority: false, assigned_to: null },
    ],
  },
];

export const todayChores = [
  { id: 'ch-1', title: 'Do the dishes', room: 'Kitchen', frequency: 'daily', assigned_to: 'demo-user-1', points: 2, estimated_minutes: 15, is_completed: false },
  { id: 'ch-2', title: 'Vacuum living room', room: 'Living room', frequency: 'weekly', assigned_to: 'demo-user-2', points: 3, estimated_minutes: 20, is_completed: false },
  { id: 'ch-3', title: 'Water the plants', room: 'Living room', frequency: 'daily', assigned_to: null, points: 1, estimated_minutes: 5, is_completed: false },
  { id: 'ch-4', title: 'Take out the bins', room: 'Kitchen', frequency: 'weekly', assigned_to: 'demo-user-1', points: 2, estimated_minutes: 5, is_completed: true, completed_by: 'demo-user-1', completed_at: '10:32 AM' },
  { id: 'ch-5', title: 'Clean bathroom', room: 'Bathroom', frequency: 'weekly', assigned_to: 'demo-user-2', points: 4, estimated_minutes: 30, is_completed: false },
];

export const allChores = [
  ...todayChores,
  { id: 'ch-6', title: 'Do laundry', room: 'Bathroom', frequency: 'weekly', assigned_to: 'demo-user-1', points: 3, estimated_minutes: 10, is_completed: false },
  { id: 'ch-7', title: 'Wipe kitchen counters', room: 'Kitchen', frequency: 'daily', assigned_to: null, points: 1, estimated_minutes: 5, is_completed: false },
  { id: 'ch-8', title: 'Mop floors', room: 'Living room', frequency: 'biweekly', assigned_to: 'demo-user-2', points: 4, estimated_minutes: 25, is_completed: false },
  { id: 'ch-9', title: 'Change bed sheets', room: 'Bedroom', frequency: 'weekly', assigned_to: 'demo-user-1', points: 3, estimated_minutes: 15, is_completed: true, completed_by: 'demo-user-2', completed_at: 'Yesterday' },
  { id: 'ch-10', title: 'Clean oven', room: 'Kitchen', frequency: 'monthly', assigned_to: null, points: 5, estimated_minutes: 45, is_completed: false },
];

export const mealPlan = [
  { id: 'mp-1', date: 'Monday', meal_slot: 'dinner', recipe: { title: 'Thai Green Curry', time: 25, difficulty: 'easy' }, servings: 2 },
  { id: 'mp-2', date: 'Tuesday', meal_slot: 'dinner', recipe: { title: 'Pasta Carbonara', time: 20, difficulty: 'easy' }, servings: 2 },
  { id: 'mp-3', date: 'Wednesday', meal_slot: 'dinner', recipe: { title: 'Honey Garlic Salmon', time: 30, difficulty: 'medium' }, servings: 2 },
  { id: 'mp-4', date: 'Thursday', meal_slot: 'dinner', recipe: null, servings: 2 },
  { id: 'mp-5', date: 'Friday', meal_slot: 'dinner', recipe: { title: 'Homemade Pizza', time: 35, difficulty: 'medium' }, servings: 2 },
];

export const trendingRecipes = [
  { id: 'r-1', title: 'Thai Green Curry', time: 25, difficulty: 'easy', rating: 4.7, perfect_for_two: true },
  { id: 'r-2', title: 'Creamy Garlic Butter Tuscan Shrimp', time: 20, difficulty: 'easy', rating: 4.8, perfect_for_two: true },
  { id: 'r-3', title: 'Lemon Herb Roasted Chicken', time: 50, difficulty: 'medium', rating: 4.5, perfect_for_two: false },
  { id: 'r-4', title: 'Mushroom Risotto', time: 40, difficulty: 'medium', rating: 4.6, perfect_for_two: true },
  { id: 'r-5', title: 'Fish Tacos with Mango Salsa', time: 25, difficulty: 'easy', rating: 4.4, perfect_for_two: true },
  { id: 'r-6', title: 'Beef Stir-Fry with Noodles', time: 20, difficulty: 'easy', rating: 4.3, perfect_for_two: false },
];

export const todayEvents = [
  { id: 'ev-1', title: 'Gym — HIIT class', time: '7:00 AM', category: 'health', for_user: 'demo-user-1' },
  { id: 'ev-2', title: 'Work call — Team standup', time: '9:30 AM', category: 'work', for_user: 'demo-user-1' },
  { id: 'ev-3', title: 'Dentist appointment', time: '2:00 PM', category: 'health', for_user: 'demo-user-2' },
  { id: 'ev-4', title: 'Date night 🍷', time: '7:30 PM', category: 'shared', for_user: null },
];

export const upcomingBills = [
  { id: 'bill-1', title: 'Rent', amount: 1600, due: '25 May', frequency: 'monthly', is_paid: false },
  { id: 'bill-2', title: 'Electricity', amount: 85, due: '28 May', frequency: 'monthly', is_paid: false },
  { id: 'bill-3', title: 'Netflix', amount: 15.99, due: '20 May', frequency: 'monthly', is_paid: true },
  { id: 'bill-4', title: 'Broadband', amount: 35, due: '1 Jun', frequency: 'monthly', is_paid: false },
];

export const recentExpenses = [
  { id: 'exp-1', title: 'Weekly groceries', amount: 67.50, paid_by: 'demo-user-1', date: 'Today', category: 'groceries' },
  { id: 'exp-2', title: 'Coffee date', amount: 12.80, paid_by: 'demo-user-2', date: 'Yesterday', category: 'dining' },
  { id: 'exp-3', title: 'Uber to airport', amount: 28.50, paid_by: 'demo-user-1', date: '2 days ago', category: 'transport' },
  { id: 'exp-4', title: 'Cleaning supplies', amount: 22.40, paid_by: 'demo-user-2', date: '3 days ago', category: 'household' },
];

export const packages = [
  { id: 'pkg-1', title: 'Amazon order — headphones', carrier: 'Amazon', status: 'out_for_delivery', expected: 'Today', assigned_to: null },
  { id: 'pkg-2', title: 'ASOS return', carrier: 'Evri', status: 'shipped', expected: '22 May', assigned_to: 'demo-user-2' },
  { id: 'pkg-3', title: 'IKEA bookshelf', carrier: 'DHL', status: 'pending', expected: '26 May', assigned_to: null },
];

export const partnerActivity = [
  { id: 'act-1', action: 'completed', item: 'Put away groceries', time: '2 min ago', user: 'demo-user-2' },
  { id: 'act-2', action: 'added', item: 'Milk to Weekly Groceries', time: '15 min ago', user: 'demo-user-2' },
  { id: 'act-3', action: 'checked off', item: 'Take out the bins', time: '35 min ago', user: 'demo-user-1' },
];

export const plants = [
  { id: 'pl-1', name: 'Monstera Deliciosa', location: 'Living room', water_freq: 7, last_watered: '2 days ago', next_watering: '5 days', light: 'bright', is_overdue: false },
  { id: 'pl-2', name: 'Snake Plant', location: 'Bedroom', water_freq: 14, last_watered: '10 days ago', next_watering: '4 days', light: 'low', is_overdue: false },
  { id: 'pl-3', name: 'Peace Lily', location: 'Bathroom', water_freq: 5, last_watered: '6 days ago', next_watering: 'Overdue!', light: 'medium', is_overdue: true },
  { id: 'pl-4', name: 'Pothos', location: 'Kitchen', water_freq: 7, last_watered: '3 days ago', next_watering: '4 days', light: 'medium', is_overdue: false },
];

export const pets = [
  { id: 'pet-1', name: 'Luna', species: 'Dog', breed: 'Cavalier King Charles', next_walk: '6:00 PM', next_meal: '6:30 PM', vet: 'Next checkup: 15 Jun' },
];

export const habits = [
  { id: 'hab-1', title: 'Morning exercise', streak: 12, category: 'fitness', frequency: 'daily', today_done: true, partner_streak: 8 },
  { id: 'hab-2', title: 'Read 20 pages', streak: 5, category: 'learning', frequency: 'daily', today_done: false, partner_streak: 15 },
  { id: 'hab-3', title: 'Drink 8 glasses of water', streak: 0, category: 'health', frequency: 'daily', today_done: false, partner_streak: 3 },
  { id: 'hab-4', title: 'Meditate 10 min', streak: 30, category: 'mindfulness', frequency: 'daily', today_done: true, partner_streak: 7 },
];

export const notes = [
  { id: 'n-1', title: 'Flat inspection checklist', content: 'Check tap washers, test smoke alarms, clean windows, fix bathroom shelf...', updated: '2 hours ago', is_pinned: true },
  { id: 'n-2', title: 'Books to read', content: '1. Project Hail Mary\n2. Klara and the Sun\n3. The Midnight Library', updated: 'Yesterday', is_pinned: false },
  { id: 'n-3', title: 'WiFi password', content: 'OurFlat2024! (changed from the default)', updated: '3 days ago', is_pinned: true },
  { id: 'n-4', title: 'Gift ideas for Sam', content: '• Cooking class voucher\n• New cookbook: Ottolenghi Simple\n• Wireless headphones', updated: '1 week ago', is_pinned: false },
];

export const savingsGoals = [
  { id: 'sg-1', title: 'Holiday to Greece', target: 2000, current: 1350, currency: '£' },
  { id: 'sg-2', title: 'Emergency fund', target: 3000, current: 2200, currency: '£' },
];

export const calendarEvents = [
  ...todayEvents,
  { id: 'ev-5', title: 'Sam — Work from home', time: 'All day', category: 'work', for_user: 'demo-user-2' },
  { id: 'ev-6', title: 'Bin collection', time: '6:00 AM', category: 'shared', for_user: null },
];
