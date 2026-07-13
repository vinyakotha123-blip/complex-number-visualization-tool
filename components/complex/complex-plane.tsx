'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Plot from '@/components/complex/plotly-chart';
import { useComplex } from '@/hooks/use-complex';
import { usePlotTheme } from '@/hooks/use-plot-theme';
import { magnitude, argumentDeg, formatComplex } from '@/lib/complex';
import { trimNumber } from '@/lib/utils';

function circlePoints(r: number, n = 100) {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * 2 * Math.PI;
    xs.push(r * Math.cos(t));
    ys.push(r * Math.sin(t));
  }
  return { xs, ys };
}

export function ComplexPlane() {
  const { z } = useComplex();
  const colors = usePlotTheme();
  const [range, setRange] = useState(6);

  const mag = magnitude(z);
  const argDeg = argumentDeg(z);
  const effectiveRange = Math.max(range, Math.ceil(mag + 1));
  const circle = useMemo(() => circlePoints(mag), [mag]);

  const data = useMemo(
    () => [
      { x: circle.xs, y: circle.ys, mode: 'lines' as const, type: 'scatter' as const, line: { color: 'rgba(124,92,255,0.35)', width: 1, dash: 'dot' as const }, hoverinfo: 'skip' as const },
      { x: [z.re, z.re], y: [0, z.im], mode: 'lines' as const, type: 'scatter' as const, line: { color: '#8a93a6', width: 1.5, dash: 'dash' as const }, hoverinfo: 'skip' as const },
      { x: [0, z.re], y: [z.im, z.im], mode: 'lines' as const, type: 'scatter' as const, line: { color: '#ff5c9e', width: 1.5, dash: 'dash' as const }, hoverinfo: 'skip' as const },
      {
        x: [0, z.re], y: [0, z.im], mode: 'lines+markers' as const, type: 'scatter' as const,
        line: { color: '#4f8bff', width: 3 }, marker: { size: [0, 10], color: '#4f8bff' },
        hovertemplate: `z = ${formatComplex(z)}<br>|z| = ${trimNumber(mag)}<br>arg = ${trimNumber(argDeg)}°<extra></extra>`,
      },
    ],
    [circle, z, mag, argDeg]
  );

  const layout = useMemo(
    () => ({
      margin: { l: 40, r: 20, t: 20, b: 36 },
      paper_bgcolor: colors.paper,
      plot_bgcolor: colors.paper,
      showlegend: false,
      xaxis: { range: [-effectiveRange, effectiveRange], zeroline: true, zerolinecolor: colors.zero, gridcolor: colors.grid, color: colors.text, title: { text: 'Re' } },
      yaxis: { range: [-effectiveRange, effectiveRange], zeroline: true, zerolinecolor: colors.zero, gridcolor: colors.grid, color: colors.text, title: { text: 'Im' }, scaleanchor: 'x' as const, scaleratio: 1 },
      font: { color: colors.text, size: 11 },
      annotations: [
        { x: z.re, y: z.im, text: `z = ${formatComplex(z)}`, showarrow: false, xshift: 10, yshift: 14, font: { color: '#4f8bff', size: 13, family: 'var(--font-mono)' }, xanchor: 'left' as const },
      ],
    }),
    [colors, effectiveRange, z]
  );

  return (
    <Card id="complex-plane" className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Complex Plane</CardTitle>
        <div className="flex gap-1.5">
          <Button size="icon" variant="ghost" aria-label="Zoom in" onClick={() => setRange((r) => Math.max(2, r - 2))}><ZoomIn className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" aria-label="Zoom out" onClick={() => setRange((r) => r + 2)}><ZoomOut className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" aria-label="Reset view" onClick={() => setRange(6)}><RotateCcw className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="pointer-events-none absolute left-2 top-2 z-10 rounded-xl border border-border bg-popover/90 p-3 text-xs shadow-panel backdrop-blur-md">
            <div className="mb-1 font-mono font-bold text-chart-blue">z = {formatComplex(z)}</div>
            <div className="flex gap-1 text-muted-foreground">a = <b className="font-mono text-foreground">{trimNumber(z.re)}</b> (Real)</div>
            <div className="flex gap-1 text-muted-foreground">b = <b className="font-mono text-foreground">{trimNumber(z.im)}</b> (Imaginary)</div>
            <div className="flex gap-1 text-muted-foreground">|z| = <b className="font-mono text-foreground">{trimNumber(mag, 3)}</b></div>
            <div className="flex gap-1 text-muted-foreground">arg(z) = <b className="font-mono text-foreground">{trimNumber(argDeg, 2)}°</b></div>
          </div>
          <div id="planeChart" className="h-[420px] w-full">
            <Plot data={data} layout={layout} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%', height: '100%' }} useResizeHandler />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><i className="inline-block h-0.5 w-4 rounded bg-chart-blue" />Magnitude |z|</span>
          <span className="flex items-center gap-1.5"><i className="inline-block h-0.5 w-4 rounded bg-[#8a93a6]" />Real Part (a)</span>
          <span className="flex items-center gap-1.5"><i className="inline-block h-0.5 w-4 rounded bg-chart-pink" />Imaginary Part (b)</span>
        </div>
      </CardContent>
    </Card>
  );
}
