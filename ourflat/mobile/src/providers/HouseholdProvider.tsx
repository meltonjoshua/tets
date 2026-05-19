import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthProvider';

interface Household {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  settings: Record<string, unknown>;
  created_at: string;
}

interface HouseholdMember {
  id: string;
  user_id: string;
  household_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  profile?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    email: string;
  };
}

interface HouseholdContextType {
  household: Household | null;
  members: HouseholdMember[];
  partner: HouseholdMember | null;
  isLoading: boolean;
  createHousehold: (name: string) => Promise<Household>;
  joinHousehold: (inviteCode: string) => Promise<void>;
  refreshHousehold: () => Promise<void>;
}

const HouseholdContext = createContext<HouseholdContextType>({
  household: null,
  members: [],
  partner: null,
  isLoading: true,
  createHousehold: async () => ({} as Household),
  joinHousehold: async () => {},
  refreshHousehold: async () => {},
});

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHousehold = useCallback(async () => {
    if (!user) {
      setHousehold(null);
      setMembers([]);
      setIsLoading(false);
      return;
    }

    const { data: memberData } = await supabase
      .from('household_members')
      .select('*, households(*)')
      .eq('user_id', user.id)
      .single();

    if (memberData?.household_id) {
      const { data: householdData } = await supabase
        .from('households')
        .select('*')
        .eq('id', memberData.household_id)
        .single();

      const { data: membersData } = await supabase
        .from('household_members')
        .select('*, profiles(*)')
        .eq('household_id', memberData.household_id);

      setHousehold(householdData);
      setMembers(membersData ?? []);
    }

    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchHousehold();
  }, [fetchHousehold]);

  const createHousehold = async (name: string): Promise<Household> => {
    const { data, error } = await supabase
      .from('households')
      .insert({ name, created_by: user!.id })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('household_members').insert({
      household_id: data.id,
      user_id: user!.id,
      role: 'admin',
    });

    await fetchHousehold();
    return data;
  };

  const joinHousehold = async (inviteCode: string) => {
    const { data: householdData, error: householdError } = await supabase
      .from('households')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (householdError) throw new Error('Invalid invite code');

    const { error: memberError } = await supabase.from('household_members').insert({
      household_id: householdData.id,
      user_id: user!.id,
      role: 'member',
    });

    if (memberError) throw memberError;
    await fetchHousehold();
  };

  const refreshHousehold = async () => {
    await fetchHousehold();
  };

  const partner = members.find((m) => m.user_id !== user?.id) ?? null;

  return (
    <HouseholdContext.Provider
      value={{
        household,
        members,
        partner,
        isLoading,
        createHousehold,
        joinHousehold,
        refreshHousehold,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  return useContext(HouseholdContext);
}