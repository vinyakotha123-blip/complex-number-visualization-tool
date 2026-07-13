'use client';

import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[200] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto w-full max-w-sm rounded-xl border px-4 py-3 text-sm shadow-panel backdrop-blur-xl',
            t.variant === 'destructive'
              ? 'border-destructive/50 bg-destructive/15 text-destructive-foreground'
              : 'border-border bg-popover text-popover-foreground'
          )}
          onClick={() => dismiss(t.id)}
          role="status"
        >
          <div className="font-semibold">{t.title}</div>
          {t.description && <div className="mt-0.5 text-xs opacity-80">{t.description}</div>}
        </div>
      ))}
    </div>
  );
}
