'use client';

import { useContext } from 'react';
import { ComplexContext } from '@/components/providers/complex-provider';

export function useComplex() {
  const ctx = useContext(ComplexContext);
  if (!ctx) throw new Error('useComplex must be used within a ComplexProvider.');
  return ctx;
}
