'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface DemoUser {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
}

export interface DemoHousehold {
  id: string;
  name: string;
  invite_code: string;
  partner: DemoUser | null;
}

interface DemoAuthContextType {
  user: DemoUser;
  household: DemoHousehold;
  isDemo: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const DEMO_USER: DemoUser = {
  id: 'demo-user-1',
  email: 'alex@ourflat.app',
  display_name: 'Alex',
  avatar_url: null,
};

export const DEMO_PARTNER: DemoUser = {
  id: 'demo-user-2',
  email: 'sam@ourflat.app',
  display_name: 'Sam',
  avatar_url: null,
};

export const DEMO_HOUSEHOLD: DemoHousehold = {
  id: 'demo-household-1',
  name: 'Our Flat',
  invite_code: 'FLAT42',
  partner: DEMO_PARTNER,
};

const DemoAuthContext = createContext<DemoAuthContextType>({
  user: DEMO_USER,
  household: DEMO_HOUSEHOLD,
  isDemo: true,
  login: () => {},
  logout: () => {},
});

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState(DEMO_USER);
  const [household] = useState(DEMO_HOUSEHOLD);

  return (
    <DemoAuthContext.Provider
      value={{
        user,
        household,
        isDemo: true,
        login: () => {},
        logout: () => {},
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  return useContext(DemoAuthContext);
}
