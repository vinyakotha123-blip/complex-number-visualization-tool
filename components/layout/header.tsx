'use client';

import { useState } from 'react';
import { Moon, Share2, Download, HelpCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/use-theme';
import { useComplex } from '@/hooks/use-complex';
import { useToast } from '@/hooks/use-toast';
import { exportChartAsPng, exportChartAsPdf, exportJson } from '@/utils/export';

export function Header() {
  const { resolved, setMode } = useTheme();
  const { z, resetToDefault } = useComplex();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleExport = async (type: 'png' | 'pdf' | 'json') => {
    setMenuOpen(false);
    try {
      if (type === 'png') await exportChartAsPng('planeChart', 'cnvt-complex-plane.png');
      if (type === 'pdf') await exportChartAsPdf('planeChart', 'cnvt-complex-plane.pdf');
      if (type === 'json') exportJson(z, 'cnvt-export.json');
      toast({ title: `Exported as ${type.toUpperCase()}` });
    } catch (err) {
      toast({ title: 'Export failed', description: (err as Error).message, variant: 'destructive' });
    }
  };

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('re', String(z.re));
    url.searchParams.set('im', String(z.im));
    try {
      await navigator.clipboard.writeText(url.toString());
      toast({ title: 'Share link copied to clipboard' });
    } catch {
      toast({ title: 'Copy this link', description: url.toString() });
    }
  };

  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Complex Number Visualization Tool</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visualize, explore &amp; understand complex numbers — Cartesian &amp; polar, live.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5">
          <Moon className="h-3.5 w-3.5 text-muted-foreground" />
          <Switch checked={resolved === 'dark'} onCheckedChange={(checked) => setMode(checked ? 'dark' : 'light')} aria-label="Toggle dark theme" />
        </div>
        <Button variant="ghost" onClick={() => {
          resetToDefault();
          toast({ title: 'Reset to default', description: 'Returned to 3 + 4i.' });
        }}><RotateCcw className="h-4 w-4" />Reset</Button>
        <Button variant="ghost" onClick={handleShare}><Share2 className="h-4 w-4" />Share</Button>
        <div className="relative">
          <Button variant="ghost" onClick={() => setMenuOpen((o) => !o)}><Download className="h-4 w-4" />Export</Button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-40 rounded-lg border border-border bg-popover p-1 shadow-panel">
              <MenuButton onClick={() => handleExport('png')}>Export as PNG</MenuButton>
              <MenuButton onClick={() => handleExport('pdf')}>Export as PDF</MenuButton>
              <MenuButton onClick={() => handleExport('json')}>Export as JSON</MenuButton>
            </div>
          )}
        </div>
        <Button size="icon" variant="ghost" aria-label="Help"><HelpCircle className="h-4 w-4" /></Button>
      </div>
    </header>
  );
}

function MenuButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full rounded-md px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-secondary/70">
      {children}
    </button>
  );
}
