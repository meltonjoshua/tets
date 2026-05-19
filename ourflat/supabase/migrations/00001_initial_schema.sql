-- OurFlat Database Schema
-- Initial migration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- AUTH & PROFILES
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- HOUSEHOLDS
-- ============================================

CREATE TABLE public.households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE DEFAULT UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can view" ON public.households FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = id AND user_id = auth.uid())
);
CREATE POLICY "Household creator can insert" ON public.households FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Household members can update" ON public.households FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = id AND user_id = auth.uid())
);

CREATE TABLE public.household_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(household_id, user_id)
);

ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view household members" ON public.household_members FOR SELECT USING (
  household_id IN (SELECT household_id FROM public.household_members WHERE user_id = auth.uid())
);
CREATE POLICY "Members can join household" ON public.household_members FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Admins can update roles" ON public.household_members FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = household_members.household_id AND user_id = auth.uid() AND role = 'admin')
);

-- ============================================
-- SHOPPING LISTS
-- ============================================

CREATE TABLE public.shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  budget NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can view lists" ON public.shopping_lists FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = shopping_lists.household_id AND user_id = auth.uid())
);
CREATE POLICY "Household members can manage lists" ON public.shopping_lists FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = shopping_lists.household_id AND user_id = auth.uid())
);

CREATE TABLE public.shopping_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit TEXT,
  category TEXT,
  priority BOOLEAN DEFAULT FALSE,
  checked BOOLEAN DEFAULT FALSE,
  assigned_to UUID REFERENCES public.profiles(id),
  photo_url TEXT,
  barcode TEXT,
  notes TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_interval_days INTEGER,
  last_purchased_at TIMESTAMPTZ,
  estimated_price NUMERIC(10,2),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can view items" ON public.shopping_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.shopping_lists sl JOIN public.household_members hm ON sl.household_id = hm.household_id WHERE sl.id = list_id AND hm.user_id = auth.uid())
);
CREATE POLICY "Household members can manage items" ON public.shopping_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.shopping_lists sl JOIN public.household_members hm ON sl.household_id = hm.household_id WHERE sl.id = list_id AND hm.user_id = auth.uid())
);

-- ============================================
-- PANTRY TRACKER
-- ============================================

CREATE TABLE public.pantry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit TEXT,
  category TEXT,
  location TEXT NOT NULL DEFAULT 'cupboard' CHECK (location IN ('fridge', 'freezer', 'cupboard', 'countertop')),
  purchase_date DATE,
  expiration_date DATE,
  barcode TEXT,
  photo_url TEXT,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pantry_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage pantry" ON public.pantry_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = pantry_items.household_id AND user_id = auth.uid())
);

-- Index for expiration queries
CREATE INDEX idx_pantry_expiration ON public.pantry_items (household_id, expiration_date) WHERE expiration_date IS NOT NULL;

-- ============================================
-- RECIPES & MEAL PLANNING
-- ============================================

CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gousto_id INTEGER,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  prep_time_minutes INTEGER,
  cooking_time_minutes INTEGER,
  total_time_minutes INTEGER,
  calories INTEGER,
  protein_grams NUMERIC(5,1),
  carbs_grams NUMERIC(5,1),
  fat_grams NUMERIC(5,1),
  servings INTEGER DEFAULT 2,
  difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  cuisine TEXT,
  dietary_tags TEXT[] DEFAULT '{}',
  rating_avg NUMERIC(3,2),
  rating_count INTEGER DEFAULT 0,
  is_perfect_for_two BOOLEAN DEFAULT FALSE,
  is_seasonal BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  ingredients JSONB DEFAULT '[]'::jsonb,
  instructions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recipes are readable by all household members" ON public.recipes FOR SELECT USING (TRUE);

CREATE TABLE public.recipe_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  notes TEXT,
  cooked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(recipe_id, user_id)
);

ALTER TABLE public.recipe_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view ratings" ON public.recipe_ratings FOR SELECT USING (TRUE);
CREATE POLICY "Users can create own ratings" ON public.recipe_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON public.recipe_ratings FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id),
  date DATE NOT NULL,
  meal_slot TEXT NOT NULL DEFAULT 'dinner' CHECK (meal_slot IN ('breakfast', 'lunch', 'dinner', 'snack')),
  servings INTEGER DEFAULT 2,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage meal plans" ON public.meal_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = meal_plans.household_id AND user_id = auth.uid())
);

-- ============================================
-- CHORES
-- ============================================

CREATE TABLE public.chores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  room TEXT,
  frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'custom')),
  custom_frequency_days INTEGER,
  assigned_to UUID REFERENCES public.profiles(id),
  auto_rotate BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 1,
  estimated_minutes INTEGER,
  is_one_off BOOLEAN DEFAULT FALSE,
  due_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage chores" ON public.chores FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = chores.household_id AND user_id = auth.uid())
);

CREATE TABLE public.chore_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chore_id UUID NOT NULL REFERENCES public.chores(id) ON DELETE CASCADE,
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  completed_by UUID NOT NULL REFERENCES public.profiles(id),
  photo_url TEXT,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chore_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can view completions" ON public.chore_completions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = chore_completions.household_id AND user_id = auth.uid())
);
CREATE POLICY "Household members can create completions" ON public.chore_completions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = chore_completions.household_id AND user_id = auth.uid())
);

-- ============================================
-- CALENDAR
-- ============================================

CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'shared' CHECK (category IN ('work', 'personal', 'shared', 'bills', 'health', 'social')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  is_all_day BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  location TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  visibility TEXT DEFAULT 'shared' CHECK (visibility IN ('shared', 'private')),
  external_id TEXT,
  source TEXT DEFAULT 'ourflat' CHECK (source IN ('ourflat', 'google', 'apple', 'outlook')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can view shared events" ON public.calendar_events FOR SELECT USING (
  (visibility = 'shared' AND EXISTS (SELECT 1 FROM public.household_members WHERE household_id = calendar_events.household_id AND user_id = auth.uid()))
  OR (created_by = auth.uid())
);
CREATE POLICY "Household members can manage events" ON public.calendar_events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = calendar_events.household_id AND user_id = auth.uid())
);

CREATE TABLE public.event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'tentative', 'declined')),
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Event attendees visible to household" ON public.event_attendees FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.calendar_events ce JOIN public.household_members hm ON ce.household_id = hm.household_id WHERE ce.id = event_id AND hm.user_id = auth.uid())
);

-- ============================================
-- MONEY & BILLS
-- ============================================

CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'GBP' CHECK (currency IN ('GBP', 'USD', 'EUR')),
  paid_by UUID NOT NULL REFERENCES public.profiles(id),
  split_type TEXT DEFAULT '50/50' CHECK (split_type IN ('50/50', 'custom_percentage', 'exact_amounts')),
  split_details JSONB DEFAULT '{}'::jsonb,
  category TEXT,
  receipt_url TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency TEXT,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage expenses" ON public.expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = expenses.household_id AND user_id = auth.uid())
);

CREATE TABLE public.bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'GBP' CHECK (currency IN ('GBP', 'USD', 'EUR')),
  due_date DATE NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'quarterly', 'annually', 'custom')),
  category TEXT NOT NULL,
  provider TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_by UUID REFERENCES public.profiles(id),
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage bills" ON public.bills FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = bills.household_id AND user_id = auth.uid())
);

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'GBP' CHECK (currency IN ('GBP', 'USD', 'EUR')),
  frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'quarterly', 'annually')),
  renewal_date DATE NOT NULL,
  category TEXT NOT NULL,
  provider TEXT,
  is_shared BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage subscriptions" ON public.subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = subscriptions.household_id AND user_id = auth.uid())
);

-- ============================================
-- NOTES & DOCUMENTS
-- ============================================

CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  folder TEXT,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT FALSE,
  is_shared BOOLEAN DEFAULT TRUE,
  reminder_at TIMESTAMPTZ,
  reminder_location TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage shared notes" ON public.notes FOR ALL USING (
  (is_shared = TRUE AND EXISTS (SELECT 1 FROM public.household_members WHERE household_id = notes.household_id AND user_id = auth.uid()))
  OR (created_by = auth.uid())
);

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('lease', 'insurance', 'inventory', 'passport', 'licence', 'utility', 'medical', 'other')),
  expiry_date DATE,
  is_emergency BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage documents" ON public.documents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = documents.household_id AND user_id = auth.uid())
);

-- ============================================
-- PETS
-- ============================================

CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  photo_url TEXT,
  date_of_birth DATE,
  weight NUMERIC(5,2),
  notes TEXT,
  vet_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage pets" ON public.pets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = pets.household_id AND user_id = auth.uid())
);

CREATE TABLE public.pet_feeding_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  time TEXT NOT NULL,
  food TEXT NOT NULL,
  amount TEXT,
  assigned_to UUID REFERENCES public.profiles(id),
  auto_rotate BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.pet_feeding_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pet household members can manage feeding" ON public.pet_feeding_schedules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.pets p JOIN public.household_members hm ON p.household_id = hm.household_id WHERE p.id = pet_id AND hm.user_id = auth.uid())
);

CREATE TABLE public.pet_medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  next_due_date DATE NOT NULL,
  notes TEXT
);

ALTER TABLE public.pet_medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pet household members can manage medications" ON public.pet_medications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.pets p JOIN public.household_members hm ON p.household_id = hm.household_id WHERE p.id = pet_id AND hm.user_id = auth.uid())
);

CREATE TABLE public.pet_walks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER NOT NULL,
  walked_by UUID NOT NULL REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pet_walks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pet household members can manage walks" ON public.pet_walks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.pets p JOIN public.household_members hm ON p.household_id = hm.household_id WHERE p.id = pet_id AND hm.user_id = auth.uid())
);

-- ============================================
-- PLANTS
-- ============================================

CREATE TABLE public.plants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT,
  photo_url TEXT,
  location TEXT,
  light_requirement TEXT CHECK (light_requirement IN ('low', 'medium', 'bright', 'direct')),
  watering_frequency_days INTEGER NOT NULL DEFAULT 7,
  last_watered_at TIMESTAMPTZ,
  next_watering_at TIMESTAMPTZ,
  fertilizing_frequency_days INTEGER,
  last_fertilized_at TIMESTAMPTZ,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage plants" ON public.plants FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = plants.household_id AND user_id = auth.uid())
);

-- ============================================
-- HABITS & GOALS
-- ============================================

CREATE TABLE public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'productivity' CHECK (category IN ('health', 'fitness', 'learning', 'mindfulness', 'productivity', 'custom')),
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  is_shared BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage shared habits" ON public.habits FOR ALL USING (
  (is_shared = TRUE AND EXISTS (SELECT 1 FROM public.household_members WHERE household_id = habits.household_id AND user_id = auth.uid()))
  OR (created_by = auth.uid())
);

CREATE TABLE public.habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  completed_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT
);

ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view habit logs" ON public.habit_logs FOR SELECT USING (
  habit_id IN (SELECT id FROM public.habits WHERE is_shared = TRUE AND EXISTS (SELECT 1 FROM public.household_members WHERE household_id = habits.household_id AND user_id = auth.uid()))
  OR habit_id IN (SELECT id FROM public.habits WHERE created_by = auth.uid())
);
CREATE POLICY "Users can create own habit logs" ON public.habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_shared BOOLEAN DEFAULT FALSE,
  target_date DATE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage shared goals" ON public.goals FOR ALL USING (
  (is_shared = TRUE AND EXISTS (SELECT 1 FROM public.household_members WHERE household_id = goals.household_id AND user_id = auth.uid()))
  OR (created_by = auth.uid())
);

CREATE TABLE public.goal_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Goal milestone access" ON public.goal_milestones FOR ALL USING (
  goal_id IN (SELECT id FROM public.goals WHERE (is_shared = TRUE AND EXISTS (SELECT 1 FROM public.household_members WHERE household_id = goals.household_id AND user_id = auth.uid())) OR created_by = auth.uid())
);

-- ============================================
-- PACKAGES & ERRANDS
-- ============================================

CREATE TABLE public.package_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  tracking_number TEXT,
  carrier TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'out_for_delivery', 'delivered', 'returned')),
  expected_delivery DATE,
  delivered_at TIMESTAMPTZ,
  pickup_assigned_to UUID REFERENCES public.profiles(id),
  delivery_photo_url TEXT,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.package_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage packages" ON public.package_deliveries FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = package_deliveries.household_id AND user_id = auth.uid())
);

CREATE TABLE public.errands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  assigned_to UUID REFERENCES public.profiles(id),
  due_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.errands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage errands" ON public.errands FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = errands.household_id AND user_id = auth.uid())
);

-- ============================================
-- GUESTS
-- ============================================

CREATE TABLE public.guest_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE,
  dietary_notes TEXT,
  preferences TEXT,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.guest_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage guests" ON public.guest_visits FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = guest_visits.household_id AND user_id = auth.uid())
);

-- ============================================
-- HOME MAINTENANCE
-- ============================================

CREATE TABLE public.appliances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  warranty_expiry DATE,
  room TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.appliances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage appliances" ON public.appliances FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = appliances.household_id AND user_id = auth.uid())
);

CREATE TABLE public.maintenance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  appliance_id UUID REFERENCES public.appliances(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  cost NUMERIC(10,2),
  performed_by TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage maintenance" ON public.maintenance_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = maintenance_logs.household_id AND user_id = auth.uid())
);

CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT
);

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage emergency contacts" ON public.emergency_contacts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = emergency_contacts.household_id AND user_id = auth.uid())
);

-- ============================================
-- WELLNESS
-- ============================================

CREATE TABLE public.wellness_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  household_id UUID NOT NULL REFERENCES public.households(id),
  mood INTEGER CHECK (mood BETWEEN 1 AND 10),
  sleep_hours NUMERIC(4,1),
  water_glasses INTEGER,
  exercise_minutes INTEGER,
  notes TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.wellness_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own wellness" ON public.wellness_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Household members can view partner wellness" ON public.wellness_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = wellness_logs.household_id AND user_id = auth.uid())
);

-- ============================================
-- NOTIFICATION PREFERENCES
-- ============================================

CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  type TEXT NOT NULL,
  push_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT FALSE,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  UNIQUE(user_id, type)
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notification prefs" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- SETTLEMENTS (for expense tracking)
-- ============================================

CREATE TABLE public.settlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  from_user UUID NOT NULL REFERENCES public.profiles(id),
  to_user UUID NOT NULL REFERENCES public.profiles(id),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'GBP',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage settlements" ON public.settlements FOR ALL USING (
  from_user = auth.uid() OR to_user = auth.uid()
);

-- ============================================
-- SAVINGS GOALS
-- ============================================

CREATE TABLE public.savings_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount NUMERIC(12,2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'GBP',
  target_date DATE,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Household members can manage savings goals" ON public.savings_goals FOR ALL USING (
  EXISTS (SELECT 1 FROM public.household_members WHERE household_id = savings_goals.household_id AND user_id = auth.uid())
);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.columns WHERE column_name = 'updated_at' AND table_schema = 'public' GROUP BY table_name
  LOOP
    EXECUTE format('
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON public.%I
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at();
    ', t);
  END LOOP;
END;
$$;

-- Function to calculate net balance between two users
CREATE OR REPLACE FUNCTION public.calculate_balance(household_id UUID)
RETURNS TABLE(from_user UUID, to_user UUID, amount NUMERIC) AS $$
WITH expenses AS (
  SELECT e.*
  FROM public.expenses e
  WHERE e.household_id = calculate_balance.household_id
),
members AS (
  SELECT hm.user_id
  FROM public.household_members hm
  WHERE hm.household_id = calculate_balance.household_id
),
paid AS (
  SELECT e.paid_by AS user_id, SUM(e.amount) AS total_paid
  FROM expenses e
  GROUP BY e.paid_by
),
owed AS (
  SELECT
    m.user_id,
    COALESCE(SM((SELECT SUM(e.amount * 0.5) FROM expenses e WHERE e.household_id = calculate_balance.household_id)), 0) AS share
  FROM members m
)
SELECT 
  CASE WHEN COALESCE(p.total_paid, 0) > COALESCE(o.share, 0) THEN p.user_id ELSE o.user_id END,
  CASE WHEN COALESCE(p.total_paid, 0) > COALESCE(o.share, 0) THEN o.user_id ELSE p.user_id END,
  ABS(COALESCE(p.total_paid, 0) - COALESCE(o.share, 0)) / 2
FROM paid p
CROSS JOIN owed o
WHERE p.user_id != o.user_id;
$$ LANGUAGE sql STABLE;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_shopping_items_list ON public.shopping_items (list_id);
CREATE INDEX idx_shopping_items_category ON public.shopping_items (category);
CREATE INDEX idx_pantry_items_household ON public.pantry_items (household_id);
CREATE INDEX idx_recipes_slug ON public.recipes (slug);
CREATE INDEX idx_recipes_gousto ON public.recipes (gousto_id);
CREATE INDEX idx_meal_plans_date ON public.meal_plans (household_id, date);
CREATE INDEX idx_chores_household ON public.chores (household_id, is_active);
CREATE INDEX idx_chore_completions_chore ON public.chore_completions (chore_id, completed_at DESC);
CREATE INDEX idx_calendar_events_time ON public.calendar_events (household_id, start_time);
CREATE INDEX idx_expenses_household_date ON public.expenses (household_id, date DESC);
CREATE INDEX idx_bills_due ON public.bills (household_id, due_date);
CREATE INDEX idx_habits_household ON public.habits (household_id);
CREATE INDEX idx_habit_logs_date ON public.habit_logs (habit_id, completed_at DESC);
CREATE INDEX idx_plants_watering ON public.plants (household_id, next_watering_at);
CREATE INDEX idx_package_deliveries_status ON public.package_deliveries (household_id, status);