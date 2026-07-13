'use client';

import { useTheme } from '@/hooks/use-theme';

export interface PlotThemeColors {
  grid: string;
  zero: string;
  text: string;
  paper: 'rgba(0,0,0,0)';
}

export function usePlotTheme(): PlotThemeColors {
  const { resolved } = useTheme();
  if (resolved === 'dark') {
    return { grid: 'rgba(255,255,255,0.08)', zero: 'rgba(255,255,255,0.28)', text: '#a3a8c2', paper: 'rgba(0,0,0,0)' };
  }
  return { grid: 'rgba(40,30,90,0.10)', zero: 'rgba(40,30,90,0.32)', text: '#5b5f79', paper: 'rgba(0,0,0,0)' };
}
