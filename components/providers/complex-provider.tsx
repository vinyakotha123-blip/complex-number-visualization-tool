'use client';

import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import type { ComplexValue } from '@/types';
import { parseComplexInput } from '@/lib/complex';

interface ComplexContextValue {
  z: ComplexValue;
  setZ: (z: ComplexValue) => void;
  inputError: string | null;
  setInput: (raw: string) => void;
  setParts: (re: number, im: number) => void;
}

export const ComplexContext = createContext<ComplexContextValue | null>(null);

export function ComplexProvider({ children }: { children: ReactNode }) {
  const [z, setZ] = useState<ComplexValue>({ re: 3, im: 4 });
  const [inputError, setInputError] = useState<string | null>(null);

  const setInput = useCallback((raw: string) => {
    try {
      const parsed = parseComplexInput(raw);
      setZ(parsed);
      setInputError(null);
    } catch (err) {
      setInputError(err instanceof Error ? err.message : 'Invalid complex number.');
    }
  }, []);

  const setParts = useCallback((re: number, im: number) => {
    if (!Number.isFinite(re) || !Number.isFinite(im)) {
      setInputError('Real and imaginary parts must be valid numbers.');
      return;
    }
    setZ({ re, im });
    setInputError(null);
  }, []);

  const value = useMemo(
    () => ({ z, setZ, inputError, setInput, setParts }),
    [z, inputError, setInput, setParts]
  );

  return <ComplexContext.Provider value={value}>{children}</ComplexContext.Provider>;
}
