'use client';

import { useComplex } from '@/hooks/use-complex';
import { formatComplex } from '@/lib/complex';

const EXAMPLES = [
  { re: 3, im: 4, color: '#4f8bff' },
  { re: -2, im: 1, color: '#37d67a' },
  { re: 1, im: -2, color: '#ff5c9e' },
  { re: -3, im: -3, color: '#ffb020' },
];

export function QuickExamples() {
  const { setZ } = useComplex();
  return (
    <div className="mt-2 border-t border-border pt-4">
      <div className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-primary">Quick Examples</div>
      <ul className="flex flex-col gap-0.5">
        {EXAMPLES.map((ex, i) => (
          <li key={i}>
            <button
              onClick={() => setZ({ re: ex.re, im: ex.im })}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: ex.color }} />
              z{i + 1} = {formatComplex({ re: ex.re, im: ex.im })}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
