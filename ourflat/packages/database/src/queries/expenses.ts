import { supabase } from '../client';
import type { Database } from '../types';

type Expense = Database['public']['Tables']['expenses']['Row'];
type ExpenseInsert = Database['public']['Tables']['expenses']['Insert'];
type Bill = Database['public']['Tables']['bills']['Row'];
type BillInsert = Database['public']['Tables']['bills']['Insert'];

export async function getExpenses(
  householdId: string,
  startDate?: string,
  endDate?: string
): Promise<Expense[]> {
  let query = supabase
    .from('expenses')
    .select('*')
    .eq('household_id', householdId)
    .order('date', { ascending: false });

  if (startDate) query = query.gte('date', startDate);
  if (endDate) query = query.lte('date', endDate);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function addExpense(expense: ExpenseInsert): Promise<Expense> {
  const { data, error } = await supabase.from('expenses').insert(expense).select().single();
  if (error) throw error;
  return data;
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw error;
}

export async function getUpcomingBills(householdId: string, days = 7): Promise<Bill[]> {
  const now = new Date();
  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate() + days);

  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('household_id', householdId)
    .gte('due_date', now.toISOString().split('T')[0])
    .lte('due_date', futureDate.toISOString().split('T')[0])
    .order('due_date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function addBill(bill: BillInsert): Promise<Bill> {
  const { data, error } = await supabase.from('bills').insert(bill).select().single();
  if (error) throw error;
  return data;
}

export async function markBillPaid(id: string, paidBy: string): Promise<Bill> {
  const { data, error } = await supabase
    .from('bills')
    .update({
      is_paid: true,
      paid_by: paidBy,
      paid_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function calculateBalance(householdId: string): Promise<{ from_user: string; to_user: string; amount: number }[]> {
  const { data, error } = await supabase.rpc('calculate_balance', { household_id: householdId });
  if (error) throw error;
  return data;
}