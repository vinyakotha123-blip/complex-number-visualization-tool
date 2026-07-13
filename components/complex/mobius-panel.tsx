'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Plot from '@/components/complex/plotly-chart';
import { useComplex } from '@/hooks/use-complex';
import { usePlotTheme } from '@/hooks/use-plot-theme';
import { mobiusTransform, isDegenerateMobius, formatComplex } from '@/lib/complex';
import type { ComplexValue } from '@/types';

export function MobiusPanel() {
  const { z } = useComplex();
  const colors = usePlotTheme();
  const [a, setA] = useState('1');
  const [b, setB] = useState('0');
  const [c, setC] = useState('0');
  const [d, setD] = useState('1');

  const av: ComplexValue = { re: parseFloat(a) || 0, im: 0 };
  const bv: ComplexValue = { re: parseFloat(b) || 0, im: 0 };
  const cv: ComplexValue = { re: parseFloat(c) || 0, im: 0 };
  const dv: ComplexValue = { re: parseFloat(d) || 0, im: 0 };

  const degenerate = isDegenerateMobius(av, bv, cv, dv);
  let w: ComplexValue | null = null;
  let error: string | null = degenerate ? 'Degenerate transform: ad − bc = 0. Adjust a, b, c, d.' : null;
  try { w = mobiusTransform(z, av, bv, cv, dv); } catch (e) { error = (e as Error).message; }

  const { traces, layout } = useMemo(() => {
    const gridTraces: any[] = [];
    const gridColor = 'rgba(124,92,255,0.28)';
    const mapPoint = (gx: number, gy: number): ComplexValue | null => {
      try {
        const mapped = mobiusTransform({ re: gx, im: gy }, av, bv, cv, dv);
        if (Number.isFinite(mapped.re) && Number.isFinite(mapped.im) && Math.abs(mapped.re) < 50 && Math.abs(mapped.im) < 50) return mapped;
        return null;
      } catch { return null; }
    };
    for (let gx = -4; gx <= 4; gx++) {
      const xs: (number | null)[] = []; const ys: (number | null)[] = [];
      for (let gy = -4; gy <= 4; gy += 0.2) {
        const m = mapPoint(gx, gy);
        xs.push(m ? m.re : null); ys.push(m ? m.im : null);
      }
      gridTraces.push({ x: xs, y: ys, mode: 'lines', type: 'scatter', line: { color: gridColor, width: 1 }, hoverinfo: 'skip' });
    }
    for (let gy = -4; gy <= 4; gy++) {
      const xs: (number | null)[] = []; const ys: (number | null)[] = [];
      for (let gx = -4; gx <= 4; gx += 0.2) {
        const m = mapPoint(gx, gy);
        xs.push(m ? m.re : null); ys.push(m ? m.im : null);
      }
      gridTraces.push({ x: xs, y: ys, mode: 'lines', type: 'scatter', line: { color: gridColor, width: 1 }, hoverinfo: 'skip' });
    }
    const pointTrace = { x: [w && Number.isFinite(w.re) ? w.re : null], y: [w && Number.isFinite(w.im) ? w.im : null], mode: 'markers', type: 'scatter', marker: { size: 11, color: '#ff5c9e' }, name: 'w = f(z)' };
    return {
      traces: [...gridTraces, pointTrace],
      layout: {
        margin: { l: 40, r: 20, t: 20, b: 36 }, paper_bgcolor: colors.paper, plot_bgcolor: colors.paper, showlegend: false,
        xaxis: { range: [-6, 6], zeroline: true, zerolinecolor: colors.zero, gridcolor: colors.grid, color: colors.text },
        yaxis: { range: [-6, 6], zeroline: true, zerolinecolor: colors.zero, gridcolor: colors.grid, color: colors.text, scaleanchor: 'x' as const, scaleratio: 1 },
        font: { color: colors.text, size: 11 },
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, colors, w?.re, w?.im]);

  return (
    <Card id="mobius">
      <CardHeader><CardTitle>Möbius Transformation</CardTitle></CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">w = (az + b) / (cz + d) — mapping a grid of the complex plane.</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5"><Label>a</Label><Input type="number" step="any" value={a} onChange={(e) => setA(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>b</Label><Input type="number" step="any" value={b} onChange={(e) => setB(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>c</Label><Input type="number" step="any" value={c} onChange={(e) => setC(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>d</Label><Input type="number" step="any" value={d} onChange={(e) => setD(e.target.value)} /></div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-border bg-secondary/30 p-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">z</span><span className="font-mono font-semibold text-chart-blue">{formatComplex(z)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">w</span><span className="font-mono font-semibold text-chart-purple">{w ? formatComplex(w) : 'undefined'}</span></div>
          </div>
          {error && <p role="alert" className="text-xs font-medium text-destructive">{error}</p>}
        </div>
        <div className="h-[360px]">
          <Plot data={traces} layout={layout} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%', height: '100%' }} useResizeHandler />
        </div>
      </CardContent>
    </Card>
  );
}
