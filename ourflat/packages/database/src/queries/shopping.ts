import { supabase } from '../client';
import type { Database } from '../types';

type ShoppingList = Database['public']['Tables']['shopping_lists']['Row'];
type ShoppingItem = Database['public']['Tables']['shopping_items']['Row'];
type ShoppingItemInsert = Database['public']['Tables']['shopping_items']['Insert'];
type ShoppingItemUpdate = Database['public']['Tables']['shopping_items']['Update'];

export async function getShoppingLists(householdId: string): Promise<ShoppingList[]> {
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('household_id', householdId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createShoppingList(
  householdId: string,
  name: string,
  createdBy: string
): Promise<ShoppingList> {
  const { data, error } = await supabase
    .from('shopping_lists')
    .insert({ household_id: householdId, name, created_by: createdBy })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getShoppingItems(listId: string): Promise<ShoppingItem[]> {
  const { data, error } = await supabase
    .from('shopping_items')
    .select('*')
    .eq('list_id', listId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function addShoppingItem(item: ShoppingItemInsert): Promise<ShoppingItem> {
  const { data, error } = await supabase
    .from('shopping_items')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateShoppingItem(
  id: string,
  updates: ShoppingItemUpdate
): Promise<ShoppingItem> {
  const { data, error } = await supabase
    .from('shopping_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteShoppingItem(id: string): Promise<void> {
  const { error } = await supabase.from('shopping_items').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleShoppingItem(
  id: string,
  checked: boolean
): Promise<ShoppingItem> {
  return updateShoppingItem(id, { checked });
}

export async function clearCheckedItems(listId: string): Promise<void> {
  const { error } = await supabase
    .from('shopping_items')
    .delete()
    .eq('list_id', listId)
    .eq('checked', true);

  if (error) throw error;
}

export async function reorderShoppingItems(items: { id: string; category: string | null }[]): Promise<void> {
  const updates = items.map((item, index) =>
    supabase.from('shopping_items').update({ category: item.category }).eq('id', item.id)
  );
  await Promise.all(updates);
}