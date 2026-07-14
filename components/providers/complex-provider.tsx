'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ComplexValue } from '@/types';
import { parseComplexInput } from '@/lib/complex';

interface ComplexContextValue {
  z: ComplexValue;
  setZ: (z: ComplexValue) => void;
  inputError: string | null;
  setInput: (raw: string) => void;
  setParts: (re: number, im: number) => void;
  resetToDefault: () => void;
}

const DEFAULT_Z: ComplexValue = { re: 3, im: 4 };

export const ComplexContext = createContext<ComplexContextValue | null>(null);

export function ComplexProvider({ children }: { children: ReactNode }) {
  const [z, setZState] = useState<ComplexValue>(DEFAULT_Z);
  const [inputError, setInputError] = useState<string | null>(null);

  const setZ = useCallback((value: ComplexValue) => {
    setZState(value);
  }, []);

  const setInput = useCallback((raw: string) => {
    try {
      const parsed = parseComplexInput(raw);
      setZ(parsed);
      setInputError(null);
    } catch (err) {
      setInputError(err instanceof Error ? err.message : 'Invalid complex number.');
    }
  }, [setZ]);

  const setParts = useCallback((re: number, im: number) => {
    if (!Number.isFinite(re) || !Number.isFinite(im)) {
      setInputError('Real and imaginary parts must be valid numbers.');
      return;
    }
    setZ({ re, im });
    setInputError(null);
  }, [setZ]);

  const resetToDefault = useCallback(() => {
    setZState(DEFAULT_Z);
    setInputError(null);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const re = parseFloat(params.get('re') ?? '');
    const im = parseFloat(params.get('im') ?? '');

    if (Number.isFinite(re) && Number.isFinite(im)) {
      setZState({ re, im });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const currentRe = url.searchParams.get('re');
    const currentIm = url.searchParams.get('im');

    if (currentRe === String(z.re) && currentIm === String(z.im)) return;

    url.searchParams.set('re', String(z.re));
    url.searchParams.set('im', String(z.im));
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, [z.re, z.im]);

  const value = useMemo(
    () => ({ z, setZ, inputError, setInput, setParts, resetToDefault }),
    [z, inputError, setInput, setParts, resetToDefault, setZ]
  );

  return <ComplexContext.Provider value={value}>{children}</ComplexContext.Provider>;
}
