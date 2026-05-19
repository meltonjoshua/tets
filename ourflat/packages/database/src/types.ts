import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          avatar_url?: string | null;
          phone?: string | null;
        };
        Update: {
          display_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
        };
      };
      households: {
        Row: {
          id: string;
          name: string;
          invite_code: string;
          created_by: string;
          settings: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          name: string;
          created_by: string;
          invite_code?: string;
          settings?: Record<string, unknown>;
        };
        Update: {
          name?: string;
          settings?: Record<string, unknown>;
        };
      };
      household_members: {
        Row: {
          id: string;
          household_id: string;
          user_id: string;
          role: 'admin' | 'member';
          joined_at: string;
        };
        Insert: {
          household_id: string;
          user_id: string;
          role?: 'admin' | 'member';
        };
        Update: {
          role?: 'admin' | 'member';
        };
      };
      shopping_lists: {
        Row: {
          id: string;
          household_id: string;
          name: string;
          icon: string | null;
          sort_order: number;
          budget: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          household_id: string;
          name: string;
          icon?: string | null;
          sort_order?: number;
          budget?: number | null;
        };
        Update: {
          name?: string;
          icon?: string | null;
          sort_order?: number;
          budget?: number | null;
        };
      };
      shopping_items: {
        Row: {
          id: string;
          list_id: string;
          name: string;
          quantity: number;
          unit: string | null;
          category: string | null;
          priority: boolean;
          checked: boolean;
          assigned_to: string | null;
          photo_url: string | null;
          barcode: string | null;
          notes: string | null;
          is_recurring: boolean;
          recurring_interval_days: number | null;
          last_purchased_at: string | null;
          estimated_price: number | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          list_id: string;
          name: string;
          created_by: string;
          quantity?: number;
          unit?: string | null;
          category?: string | null;
          priority?: boolean;
          assigned_to?: string | null;
          photo_url?: string | null;
          barcode?: string | null;
          notes?: string | null;
          is_recurring?: boolean;
          recurring_interval_days?: number | null;
          estimated_price?: number | null;
        };
        Update: {
          name?: string;
          quantity?: number;
          unit?: string | null;
          category?: string | null;
          priority?: boolean;
          checked?: boolean;
          assigned_to?: string | null;
          is_recurring?: boolean;
          recurring_interval_days?: number | null;
          estimated_price?: number | null;
        };
      };
      pantry_items: {
        Row: {
          id: string;
          household_id: string;
          name: string;
          quantity: number;
          unit: string | null;
          category: string | null;
          location: 'fridge' | 'freezer' | 'cupboard' | 'countertop';
          purchase_date: string | null;
          expiration_date: string | null;
          barcode: string | null;
          photo_url: string | null;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          household_id: string;
          name: string;
          created_by: string;
          quantity?: number;
          unit?: string | null;
          category?: string | null;
          location?: 'fridge' | 'freezer' | 'cupboard' | 'countertop';
          purchase_date?: string | null;
          expiration_date?: string | null;
          barcode?: string | null;
        };
        Update: {
          quantity?: number;
          expiration_date?: string | null;
        };
      };
      recipes: {
        Row: {
          id: string;
          gousto_id: number | null;
          title: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          prep_time_minutes: number | null;
          cooking_time_minutes: number | null;
          total_time_minutes: number | null;
          calories: number | null;
          protein_grams: number | null;
          carbs_grams: number | null;
          fat_grams: number | null;
          servings: number;
          difficulty: 'easy' | 'medium' | 'hard';
          cuisine: string | null;
          dietary_tags: string[];
          rating_avg: number | null;
          rating_count: number;
          is_perfect_for_two: boolean;
          is_seasonal: boolean;
          is_trending: boolean;
          ingredients: unknown[];
          instructions: unknown[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          slug: string;
          gousto_id?: number | null;
          description?: string | null;
          image_url?: string | null;
          prep_time_minutes?: number | null;
          cooking_time_minutes?: number | null;
          total_time_minutes?: number | null;
          calories?: number | null;
          servings?: number;
          difficulty?: 'easy' | 'medium' | 'hard';
          cuisine?: string | null;
          dietary_tags?: string[];
          ingredients?: unknown[];
          instructions?: unknown[];
        };
        Update: {
          title?: string;
          rating_avg?: number | null;
          rating_count?: number;
        };
      };
      chores: {
        Row: {
          id: string;
          household_id: string;
          title: string;
          description: string | null;
          room: string | null;
          frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
          custom_frequency_days: number | null;
          assigned_to: string | null;
          auto_rotate: boolean;
          points: number;
          estimated_minutes: number | null;
          is_one_off: boolean;
          due_date: string | null;
          is_active: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          household_id: string;
          title: string;
          created_by: string;
          frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
          room?: string | null;
          assigned_to?: string | null;
          auto_rotate?: boolean;
          points?: number;
          estimated_minutes?: number | null;
          is_one_off?: boolean;
          due_date?: string | null;
        };
        Update: {
          title?: string;
          assigned_to?: string | null;
          is_active?: boolean;
          due_date?: string | null;
        };
      };
      chore_completions: {
        Row: {
          id: string;
          chore_id: string;
          household_id: string;
          completed_by: string;
          photo_url: string | null;
          notes: string | null;
          completed_at: string;
        };
        Insert: {
          chore_id: string;
          household_id: string;
          completed_by: string;
          photo_url?: string | null;
          notes?: string | null;
        };
        Update: {};
      };
      calendar_events: {
        Row: {
          id: string;
          household_id: string;
          title: string;
          description: string | null;
          category: 'work' | 'personal' | 'shared' | 'bills' | 'health' | 'social';
          start_time: string;
          end_time: string | null;
          is_all_day: boolean;
          is_recurring: boolean;
          recurrence_rule: string | null;
          location: string | null;
          created_by: string;
          visibility: 'shared' | 'private';
          external_id: string | null;
          source: 'ourflat' | 'google' | 'apple' | 'outlook';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          household_id: string;
          title: string;
          start_time: string;
          created_by: string;
          category?: 'work' | 'personal' | 'shared' | 'bills' | 'health' | 'social';
          end_time?: string | null;
          is_all_day?: boolean;
          location?: string | null;
          visibility?: 'shared' | 'private';
        };
        Update: {
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string | null;
          category?: 'work' | 'personal' | 'shared' | 'bills' | 'health' | 'social';
          location?: string | null;
        };
      };
      expenses: {
        Row: {
          id: string;
          household_id: string;
          title: string;
          amount: number;
          currency: 'GBP' | 'USD' | 'EUR';
          paid_by: string;
          split_type: '50/50' | 'custom_percentage' | 'exact_amounts';
          split_details: Record<string, unknown>;
          category: string | null;
          receipt_url: string | null;
          date: string;
          is_recurring: boolean;
          recurring_frequency: string | null;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          household_id: string;
          title: string;
          amount: number;
          paid_by: string;
          created_by: string;
          date?: string;
          currency?: 'GBP' | 'USD' | 'EUR';
          split_type?: '50/50' | 'custom_percentage' | 'exact_amounts';
          category?: string | null;
        };
        Update: {
          amount?: number;
          split_type?: '50/50' | 'custom_percentage' | 'exact_amounts';
          split_details?: Record<string, unknown>;
        };
      };
      bills: {
        Row: {
          id: string;
          household_id: string;
          title: string;
          amount: number;
          currency: 'GBP' | 'USD' | 'EUR';
          due_date: string;
          frequency: 'monthly' | 'quarterly' | 'annually' | 'custom';
          category: string;
          provider: string | null;
          is_paid: boolean;
          paid_by: string | null;
          paid_at: string | null;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          household_id: string;
          title: string;
          amount: number;
          due_date: string;
          category: string;
          created_by: string;
          frequency?: 'monthly' | 'quarterly' | 'annually' | 'custom';
          currency?: 'GBP' | 'USD' | 'EUR';
        };
        Update: {
          is_paid?: boolean;
          paid_by?: string | null;
          paid_at?: string | null;
        };
      };
      habits: {
        Row: {
          id: string;
          household_id: string;
          title: string;
          description: string | null;
          category: 'health' | 'fitness' | 'learning' | 'mindfulness' | 'productivity' | 'custom';
          frequency: 'daily' | 'weekly';
          is_shared: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          household_id: string;
          title: string;
          created_by: string;
          category?: 'health' | 'fitness' | 'learning' | 'mindfulness' | 'productivity' | 'custom';
          frequency?: 'daily' | 'weekly';
          is_shared?: boolean;
        };
        Update: {
          title?: string;
          is_shared?: boolean;
        };
      };
      habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_at: string;
          notes: string | null;
        };
        Insert: {
          habit_id: string;
          user_id: string;
        };
        Update: {};
      };
      notes: {
        Row: {
          id: string;
          household_id: string;
          title: string;
          content: string;
          folder: string | null;
          tags: string[];
          is_pinned: boolean;
          is_shared: boolean;
          reminder_at: string | null;
          reminder_location: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          household_id: string;
          title: string;
          created_by: string;
          content?: string;
          folder?: string | null;
          tags?: string[];
          is_pinned?: boolean;
          is_shared?: boolean;
        };
        Update: {
          title?: string;
          content?: string;
          folder?: string | null;
          tags?: string[];
          is_pinned?: boolean;
        };
      };
      plants: {
        Row: {
          id: string;
          household_id: string;
          name: string;
          species: string | null;
          photo_url: string | null;
          location: string | null;
          light_requirement: 'low' | 'medium' | 'bright' | 'direct' | null;
          watering_frequency_days: number;
          last_watered_at: string | null;
          next_watering_at: string | null;
          fertilizing_frequency_days: number | null;
          last_fertilized_at: string | null;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          household_id: string;
          name: string;
          watering_frequency_days: number;
          created_by: string;
          species?: string | null;
          location?: string | null;
        };
        Update: {
          last_watered_at?: string | null;
          next_watering_at?: string | null;
        };
      };
      package_deliveries: {
        Row: {
          id: string;
          household_id: string;
          title: string;
          tracking_number: string | null;
          carrier: string | null;
          status: 'pending' | 'shipped' | 'out_for_delivery' | 'delivered' | 'returned';
          expected_delivery: string | null;
          delivered_at: string | null;
          pickup_assigned_to: string | null;
          delivery_photo_url: string | null;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          household_id: string;
          title: string;
          created_by: string;
          tracking_number?: string | null;
          carrier?: string | null;
          expected_delivery?: string | null;
        };
        Update: {
          status?: 'pending' | 'shipped' | 'out_for_delivery' | 'delivered' | 'returned';
          pickup_assigned_to?: string | null;
        };
      };
    };
    Views: {};
    Functions: {
      calculate_balance: {
        Args: { household_id: string };
        Returns: { from_user: string; to_user: string; amount: number }[];
      };
    };
  };
};

export type { Database };