import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/lib/i18n';
import { useAuth, Profile } from '@/hooks/useAuth';
import type { User } from '@supabase/supabase-js';
import { Sentry } from '@/lib/sentry';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  city: string;
  setCity: (city: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Auth
  user: User | null;
  profile: Profile | null;
  authLoading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  fetchProfile: (userId: string) => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('sobutylnik-lang') as Language) || 'ru';
  });
  const [city, setCityState] = useState(() => {
    return localStorage.getItem('sobutylnik-city') || 'kyiv';
  });
  const [activeTab, setActiveTab] = useState('search');
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      Sentry.setUser({ id: auth.user.id, email: auth.user.email });
    } else {
      Sentry.setUser(null);
    }
  }, [auth.user]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sobutylnik-lang', lang);
  };

  const setCity = (c: string) => {
    setCityState(c);
    localStorage.setItem('sobutylnik-city', c);
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage, city, setCity, activeTab, setActiveTab,
      user: auth.user,
      profile: auth.profile,
      authLoading: auth.loading,
      signUp: auth.signUp,
      signIn: auth.signIn,
      signOut: auth.signOut,
      updateProfile: auth.updateProfile,
      fetchProfile: auth.fetchProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
