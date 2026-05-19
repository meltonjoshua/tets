import { supabase } from '../client';
import type { Database } from '../types';

type Recipe = Database['public']['Tables']['recipes']['Row'];
type MealPlan = Database['public']['Tables']['meal_plans']['Row'];

interface RecipeSearchParams {
  dietaryTags?: string[];
  cuisine?: string;
  maxTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  query?: string;
  limit?: number;
  offset?: number;
}

export async function getRecipes(params: RecipeSearchParams = {}): Promise<Recipe[]> {
  let query = supabase.from('recipes').select('*');

  if (params.query) {
    query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`);
  }

  if (params.cuisine) {
    query = query.eq('cuisine', params.cuisine);
  }

  if (params.difficulty) {
    query = query.eq('difficulty', params.difficulty);
  }

  if (params.maxTime) {
    query = query.lte('total_time_minutes', params.maxTime);
  }

  if (params.dietaryTags && params.dietaryTags.length > 0) {
    query = query.contains('dietary_tags', params.dietaryTags);
  }

  query = query
    .order('rating_avg', { ascending: false, nullsFirst: false })
    .range(params.offset ?? 0, (params.offset ?? 0) + (params.limit ?? 20) - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getTrendingRecipes(limit = 10): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('is_trending', true)
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getMealPlan(
  householdId: string,
  startDate: string,
  endDate: string
): Promise<MealPlan[]> {
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*, recipes(*)')
    .eq('household_id', householdId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function addMealPlan(
  householdId: string,
  recipeId: string,
  date: string,
  mealSlot: string,
  servings: number,
  createdBy: string
): Promise<MealPlan> {
  const { data, error } = await supabase
    .from('meal_plans')
    .insert({
      household_id: householdId,
      recipe_id: recipeId,
      date,
      meal_slot: mealSlot,
      servings,
      created_by: createdBy,
    } as Database['public']['Tables']['meal_plans']['Insert'])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeMealPlan(id: string): Promise<void> {
  const { error } = await supabase.from('meal_plans').delete().eq('id', id);
  if (error) throw error;
}

export async function rateRecipe(
  recipeId: string,
  userId: string,
  rating: number,
  notes?: string
): Promise<void> {
  const { error } = await supabase.from('recipe_ratings').upsert({
    recipe_id: recipeId,
    user_id: userId,
    rating,
    notes,
    cooked_at: new Date().toISOString(),
  } as Database['public']['Tables']['recipe_ratings']['Insert']);

  if (error) throw error;
}