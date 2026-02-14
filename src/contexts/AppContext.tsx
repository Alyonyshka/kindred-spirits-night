import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/lib/i18n';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  city: string;
  setCity: (city: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
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

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sobutylnik-lang', lang);
  };

  const setCity = (c: string) => {
    setCityState(c);
    localStorage.setItem('sobutylnik-city', c);
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, city, setCity, activeTab, setActiveTab }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
