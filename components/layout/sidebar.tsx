'use client';

import { Atom, Home, Compass, Sigma, Shuffle, Infinity as InfinityIcon, FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickExamples } from '@/components/complex/quick-examples';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'complex-plane', label: 'Complex Plane', icon: Compass },
  { id: 'polar-plane', label: 'Polar Plane', icon: Compass },
  { id: 'operations', label: 'Operations', icon: Sigma },
  { id: 'transformations', label: 'Transformations', icon: Shuffle },
  { id: 'mobius', label: 'Möbius Transform', icon: InfinityIcon },
  { id: 'saved-graphs', label: 'Saved Graphs', icon: FolderOpen },
];

export function Sidebar({ className = '' }: { className?: string }) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <aside className={`flex h-full w-64 flex-shrink-0 flex-col gap-5 border-r border-border bg-card/50 p-4 backdrop-blur-xl ${className}`}>
      <div className="flex items-center gap-2.5 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#4f8bff] text-white shadow-glow">
          <Atom className="h-5 w-5" />
        </div>
        <div>
          <div className="font-display text-sm font-extrabold tracking-wide">CNVT</div>
          <div className="text-[10px] text-muted-foreground">Complex Numbers</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            <item.icon className="h-4 w-4 opacity-90" />
            {item.label}
          </button>
        ))}
      </nav>

      <QuickExamples />

      <Button className="mt-auto" onClick={() => scrollTo('complex-plane')}>
        <Plus className="h-4 w-4" />
        Add to Plot
      </Button>
    </aside>
  );
}
