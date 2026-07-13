'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ThemeMode } from '@/types';

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: 'dark' | 'light';
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'cnvt-theme';

function resolveMode(mode: ThemeMode): 'dark' | 'light' {
  if (mode === 'system') {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [resolved, setResolved] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'dark';
    setModeState(stored);
    const r = resolveMode(stored);
    setResolved(r);
    document.documentElement.classList.toggle('dark', r === 'dark');
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (mode === 'system') {
        const r = resolveMode('system');
        setResolved(r);
        document.documentElement.classList.toggle('dark', r === 'dark');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    const r = resolveMode(next);
    setResolved(r);
    document.documentElement.classList.toggle('dark', r === 'dark');
  }, []);

  const value = useMemo(() => ({ mode, resolved, setMode }), [mode, resolved, setMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
