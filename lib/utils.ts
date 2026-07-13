import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Rounds a number to `precision` decimal places and strips trailing zeros. */
export function trimNumber(value: number, precision = 4): string {
  if (!Number.isFinite(value)) return value > 0 ? '∞' : '-∞';
  const rounded = Number(value.toFixed(precision));
  return rounded.toString();
}

export function randomHexColor(seed: number): string {
  const palette = ['#4f8bff', '#37d67a', '#ff5c9e', '#ffb020', '#b98cff', '#ff8a5c'];
  return palette[seed % palette.length];
}
