'use client';

import { useCallback, useEffect, useState } from 'react';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners: Set<Listener> = new Set();

function emit() {
  listeners.forEach((l) => l(toasts));
}

export function pushToast(toast: Omit<ToastItem, 'id'>) {
  const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  toasts = [...toasts, { ...toast, id }];
  emit();
  setTimeout(() => dismissToast(id), 3200);
  return id;
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function useToast() {
  const [items, setItems] = useState<ToastItem[]>(toasts);

  useEffect(() => {
    listeners.add(setItems);
    return () => {
      listeners.delete(setItems);
    };
  }, []);

  const toast = useCallback((t: Omit<ToastItem, 'id'>) => pushToast(t), []);

  return { toasts: items, toast, dismiss: dismissToast };
}
