import { supabase } from '../client';
import type { Database } from '../types';

type CalendarEvent = Database['public']['Tables']['calendar_events']['Row'];
type CalendarEventInsert = Database['public']['Tables']['calendar_events']['Insert'];
type CalendarEventUpdate = Database['public']['Tables']['calendar_events']['Update'];

export async function getCalendarEvents(
  householdId: string,
  startDate: string,
  endDate: string,
  userId: string
): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('household_id', householdId)
    .gte('start_time', startDate)
    .lte('start_time', endDate)
    .or(`visibility.eq.shared,created_by.eq.${userId}`)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createCalendarEvent(event: CalendarEventInsert): Promise<CalendarEvent> {
  const { data, error } = await supabase.from('calendar_events').insert(event).select().single();
  if (error) throw error;
  return data;
}

export async function updateCalendarEvent(
  id: string,
  updates: CalendarEventUpdate
): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('calendar_events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  const { error } = await supabase.from('calendar_events').delete().eq('id', id);
  if (error) throw error;
}

export async function getTodaysEvents(householdId: string, userId: string): Promise<CalendarEvent[]> {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

  return getCalendarEvents(householdId, startOfDay, endOfDay, userId);
}