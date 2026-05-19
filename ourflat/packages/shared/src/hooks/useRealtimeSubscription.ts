import { useEffect, useState, useCallback, useRef } from 'react';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type SupabaseClient = import('@supabase/supabase-js').SupabaseClient;

export function useRealtimeSubscription<T extends { id: string }>(
  supabase: SupabaseClient,
  table: string,
  householdId: string,
  onSuccess?: (payload: RealtimePostgresChangesPayload<T>) => void
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const { data: rows, error } = await supabase
      .from(table)
      .select('*')
      .eq('household_id', householdId)
      .order('created_at', { ascending: false });

    if (!error && rows) {
      setData(rows as T[]);
    }
    setIsLoading(false);
  }, [supabase, table, householdId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const channel = supabase
      .channel(`${table}:${householdId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter: `household_id=eq.${householdId}` },
        (payload: RealtimePostgresChangesPayload<T>) => {
          const newRecord = payload.new as T;
          const oldRecord = payload.old as T;

          if (payload.eventType === 'INSERT') {
            setData((prev) => [newRecord, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) => prev.map((item) => (item.id === newRecord.id ? newRecord : item)));
          } else if (payload.eventType === 'DELETE') {
            setData((prev) => prev.filter((item) => item.id !== oldRecord.id));
          }

          onSuccess?.(payload);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [supabase, table, householdId, onSuccess]);

  return { data, isLoading, refetch: fetchData };
}