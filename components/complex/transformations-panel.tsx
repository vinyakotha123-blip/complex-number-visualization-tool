'use client';

import { useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Plot from '@/components/complex/plotly-chart';
import { useComplex } from '@/hooks/use-complex';
import { usePlotTheme } from '@/hooks/use-plot-theme';
import { translate, rotate, scale as scaleC, reflect, formatComplex, magnitude } from '@/lib/complex';
import type { ComplexValue, ReflectAxis, TransformType } from '@/types';
import { Play } from 'lucide-react';

export function TransformationsPanel() {
  const { z } = useComplex();
  const colors = usePlotTheme();
  const [type, setType] = useState<TransformType>('translate');
  const [dRe, setDRe] = useState('2');
  const [dIm, setDIm] = useState('2');
  const [angle, setAngle] = useState('90');
  const [factor, setFactor] = useState('1.5');
  const [axis, setAxis] = useState<ReflectAxis>('real');
  const [t, setT] = useState(1);
  const rafRef = useRef<number | null>(null);

  const target = useMemo<ComplexValue>(() => {
    switch (type) {
      case 'translate': return translate(z, { re: parseFloat(dRe) || 0, im: parseFloat(dIm) || 0 });
      case 'rotate': return rotate(z, parseFloat(angle) || 0);
      case 'scale': return scaleC(z, Number.isFinite(parseFloat(factor)) ? parseFloat(factor) : 1);
      case 'reflect': return reflect(z, axis);
    }
  }, [type, z, dRe, dIm, angle, factor, axis]);

  const animate = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const duration = 900;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setT(1 - Math.pow(1 - progress, 3));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    setT(0);
    rafRef.current = requestAnimationFrame(step);
  };

  const current: ComplexValue = { re: z.re + (target.re - z.re) * t, im: z.im + (target.im - z.im) * t };
  const range = Math.max(4, Math.ceil(Math.max(magnitude(z), magnitude(target)) + 1));

  const data = [
    { x: [0, z.re], y: [0, z.im], mode: 'lines+markers' as const, type: 'scatter' as const, line: { color: '#4f8bff', width: 2.5, dash: 'dot' as const }, marker: { size: [0, 7], color: '#4f8bff' }, name: 'Original z' },
    { x: [0, target.re], y: [0, target.im], mode: 'lines' as const, type: 'scatter' as const, line: { color: 'rgba(185,140,255,0.35)', width: 2, dash: 'dot' as const }, name: "Target z'", hoverinfo: 'skip' as const },
    { x: [0, current.re], y: [0, current.im], mode: 'lines+markers' as const, type: 'scatter' as const, line: { color: '#b98cff', width: 3 }, marker: { size: [0, 9], color: '#b98cff' }, name: 'Animating' },
  ];
  const layout = {
    margin: { l: 40, r: 20, t: 20, b: 36 }, paper_bgcolor: colors.paper, plot_bgcolor: colors.paper,
    showlegend: true, legend: { font: { color: colors.text, size: 10 }, orientation: 'h' as const, y: -0.2 },
    xaxis: { range: [-range, range], zeroline: true, zerolinecolor: colors.zero, gridcolor: colors.grid, color: colors.text },
    yaxis: { range: [-range, range], zeroline: true, zerolinecolor: colors.zero, gridcolor: colors.grid, color: colors.text, scaleanchor: 'x' as const, scaleratio: 1 },
    font: { color: colors.text, size: 11 },
  };

  return (
    <Card id="transformations">
      <CardHeader><CardTitle>Transformations</CardTitle></CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-3">
          <div className="space-y-1.5">
            <Label>Transformation</Label>
            <Select value={type} onValueChange={(v) => setType(v as TransformType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="translate">Translation</SelectItem>
                <SelectItem value="rotate">Rotation</SelectItem>
                <SelectItem value="scale">Scaling</SelectItem>
                <SelectItem value="reflect">Reflection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'translate' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5"><Label>Δa</Label><Input type="number" step="any" value={dRe} onChange={(e) => setDRe(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Δb</Label><Input type="number" step="any" value={dIm} onChange={(e) => setDIm(e.target.value)} /></div>
            </div>
          )}
          {type === 'rotate' && (
            <div className="space-y-1.5"><Label>Angle θ (degrees)</Label><Input type="number" step="any" value={angle} onChange={(e) => setAngle(e.target.value)} /></div>
          )}
          {type === 'scale' && (
            <div className="space-y-1.5"><Label>Scale factor k</Label><Input type="number" step="any" value={factor} onChange={(e) => setFactor(e.target.value)} /></div>
          )}
          {type === 'reflect' && (
            <div className="space-y-1.5">
              <Label>Reflect across</Label>
              <Select value={axis} onValueChange={(v) => setAxis(v as ReflectAxis)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="real">Real Axis</SelectItem>
                  <SelectItem value="imaginary">Imaginary Axis</SelectItem>
                  <SelectItem value="origin">Origin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={animate}><Play className="h-4 w-4" />Animate Transformation</Button>

          <div className="mt-2 flex flex-col gap-1 rounded-xl border border-border bg-secondary/30 p-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Original z</span><span className="font-mono font-semibold text-chart-blue">{formatComplex(z)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Transformed z&apos;</span><span className="font-mono font-semibold text-chart-purple">{formatComplex(target)}</span></div>
          </div>
        </div>

        <div className="h-[360px]">
          <Plot data={data} layout={layout} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%', height: '100%' }} useResizeHandler />
        </div>
      </CardContent>
    </Card>
  );
}
