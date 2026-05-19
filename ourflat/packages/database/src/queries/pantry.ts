import { supabase } from '../client';
import type { Database } from '../types';

type PantryItem = Database['public']['Tables']['pantry_items']['Row'];
type PantryItemInsert = Database['public']['Tables']['pantry_items']['Insert'];
type PantryItemUpdate = Database['public']['Tables']['pantry_items']['Update'];

export async function getPantryItems(householdId: string): Promise<PantryItem[]> {
  const { data, error } = await supabase
    .from('pantry_items')
    .select('*')
    .eq('household_id', householdId)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPantryItemsByLocation(
  householdId: string,
  location: 'fridge' | 'freezer' | 'cupboard' | 'countertop'
): Promise<PantryItem[]> {
  const { data, error } = await supabase
    .from('pantry_items')
    .select('*')
    .eq('household_id', householdId)
    .eq('location', location)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getExpiringItems(householdId: string, days = 3): Promise<PantryItem[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const { data, error } = await supabase
    .from('pantry_items')
    .select('*')
    .eq('household_id', householdId)
    .not('expiration_date', 'is', null)
    .lte('expiration_date', futureDate.toISOString().split('T')[0])
    .order('expiration_date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function addPantryItem(item: PantryItemInsert): Promise<PantryItem> {
  const { data, error } = await supabase.from('pantry_items').insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function updatePantryItem(id: string, updates: PantryItemUpdate): Promise<PantryItem> {
  const { data, error } = await supabase
    .from('pantry_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePantryItem(id: string): Promise<void> {
  const { error } = await supabase.from('pantry_items').delete().eq('id', id);
  if (error) throw error;
}

export async function moveToShoppingList(pantryItemId: string, householdId: string, listId: string, createdBy: string): Promise<void> {
  const { data: item } = await supabase.from('pantry_items').select('name, quantity, unit, category').eq('id', pantryItemId).single();

  if (item) {
    await supabase.from('shopping_items').insert({
      list_id: listId,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      created_by: createdBy,
    } as Database['public']['Tables']['shopping_items']['Insert']);
  }
}