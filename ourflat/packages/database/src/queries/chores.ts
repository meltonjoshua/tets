import { supabase } from '../client';
import type { Database } from '../types';

type Chore = Database['public']['Tables']['chores']['Row'];
type ChoreInsert = Database['public']['Tables']['chores']['Insert'];
type ChoreUpdate = Database['public']['Tables']['chores']['Update'];
type ChoreCompletion = Database['public']['Tables']['chore_completions']['Row'];
type ChoreCompletionInsert = Database['public']['Tables']['chore_completions']['Insert'];

export async function getChores(householdId: string, activeOnly = true): Promise<Chore[]> {
  let query = supabase
    .from('chores')
    .select('*')
    .eq('household_id', householdId);

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query.order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createChore(chore: ChoreInsert): Promise<Chore> {
  const { data, error } = await supabase.from('chores').insert(chore).select().single();
  if (error) throw error;
  return data;
}

export async function updateChore(id: string, updates: ChoreUpdate): Promise<Chore> {
  const { data, error } = await supabase
    .from('chores')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteChore(id: string): Promise<void> {
  const { error } = await supabase.from('chores').delete().eq('id', id);
  if (error) throw error;
}

export async function completeChore(completion: ChoreCompletionInsert): Promise<ChoreCompletion> {
  const { data, error } = await supabase
    .from('chore_completions')
    .insert(completion)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getChoreCompletions(
  choreId: string,
  limit = 30
): Promise<ChoreCompletion[]> {
  const { data, error } = await supabase
    .from('chore_completions')
    .select('*')
    .eq('chore_id', choreId)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getHouseholdChoreCompletions(
  householdId: string,
  days = 7
): Promise<ChoreCompletion[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('chore_completions')
    .select('*')
    .eq('household_id', householdId)
    .gte('completed_at', since.toISOString())
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data;
}