export const MODULES = {
  SHOPPING: 'shopping',
  MEALS: 'meals',
  CHORES: 'chores',
  CALENDAR: 'calendar',
  MONEY: 'money',
  NOTES: 'notes',
  PETS: 'pets',
  PLANTS: 'plants',
  HABITS: 'habits',
  PACKAGES: 'packages',
} as const;

export type ModuleKey = (typeof MODULES)[keyof typeof MODULES];

export const CHORE_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
} as const;

export const EXPENSE_SPLIT_TYPE = {
  FIFTY_FIFTY: '50/50',
  CUSTOM_PERCENTAGE: 'custom_percentage',
  EXACT_AMOUNTS: 'exact_amounts',
} as const;

export const MEAL_SLOT = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
} as const;

export const PANTRY_LOCATION = {
  FRIDGE: 'fridge',
  FREEZER: 'freezer',
  CUPBOARD: 'cupboard',
  COUNTERTOP: 'countertop',
} as const;

export const EVENT_CATEGORY = {
  WORK: 'work',
  PERSONAL: 'personal',
  SHARED: 'shared',
  BILLS: 'bills',
  HEALTH: 'health',
  SOCIAL: 'social',
} as const;

export const NOTIFICATION_TYPE = {
  CHORE_DUE: 'chore_due',
  CHORE_OVERDUE: 'chore_overdue',
  SHOPPING_ITEM_ADDED: 'shopping_item_added',
  MEAL_PLAN_UPDATE: 'meal_plan_update',
  BILL_DUE: 'bill_due',
  PACKAGE_DELIVERED: 'package_delivered',
  HABIT_REMINDER: 'habit_reminder',
  EXPIRATION_WARNING: 'expiration_warning',
  PARTNER_ACTIVITY: 'partner_activity',
  AI_SUGGESTION: 'ai_suggestion',
} as const;

export const CURRENCY = {
  GBP: 'GBP',
  USD: 'USD',
  EUR: 'EUR',
} as const;

export const SHOPPING_CATEGORIES = [
  'fruit_veg',
  'dairy',
  'meat_fish',
  'bakery',
  'frozen',
  'drinks',
  'snacks',
  'household',
  'personal_care',
  'pet_supplies',
  'other',
] as const;

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const MAX_FREE_LISTS = 3;
export const MAX_FREE_RECURRING_CHORES = 10;
export const MAX_FREE_RECIPES_PER_WEEK = 5;

export const DEFAULT_STORE_LAYOUT = [
  'fruit_veg',
  'bakery',
  'meat_fish',
  'dairy',
  'drinks',
  'frozen',
  'snacks',
  'household',
  'personal_care',
  'pet_supplies',
  'other',
] as const;