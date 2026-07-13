'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Plot from '@/components/complex/plotly-chart';
import { useComplex } from '@/hooks/use-complex';
import { usePlotTheme } from '@/hooks/use-plot-theme';
import {
  parseComplexInput, formatComplex, addC, subC, mulC, divC, powC, sqrtC, conjugate, reciprocal, magnitude,
} from '@/lib/complex';
import type { ComplexValue, OperationType } from '@/types';
import { Calculator } from 'lucide-react';

const OPERATIONS: { value: OperationType; label: string; needsZ2: boolean; needsN?: boolean }[] = [
  { value: 'add', label: 'Addition (z₁ + z₂)', needsZ2: true },
  { value: 'subtract', label: 'Subtraction (z₁ − z₂)', needsZ2: true },
  { value: 'multiply', label: 'Multiplication (z₁ × z₂)', needsZ2: true },
  { value: 'divide', label: 'Division (z₁ / z₂)', needsZ2: true },
  { value: 'power', label: 'Power (z₁ ^ n)', needsZ2: false, needsN: true },
  { value: 'sqrt', label: 'Square Root (√z₁)', needsZ2: false },
  { value: 'conjugate', label: 'Conjugate (z̄₁)', needsZ2: false },
  { value: 'inverse', label: 'Inverse (1/z₁)', needsZ2: false },
];

export function OperationsPanel() {
  const { z } = useComplex();
  const colors = usePlotTheme();
  const [op, setOp] = useState<OperationType>('add');
  const [z1Text, setZ1Text] = useState(formatComplex(z));
  const [z2Text, setZ2Text] = useState('-2 + i');
  const [nText, setNText] = useState('2');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ z1: ComplexValue; z2: ComplexValue | null; out: ComplexValue } | null>(null);

  const meta = OPERATIONS.find((o) => o.value === op)!;

  const calculate = () => {
    setError(null);
    let z1: ComplexValue, z2: ComplexValue | null = null;
    try { z1 = parseComplexInput(z1Text); } catch (e) { setError(`z₁: ${(e as Error).message}`); return; }
    if (meta.needsZ2) {
      try { z2 = parseComplexInput(z2Text); } catch (e) { setError(`z₂: ${(e as Error).message}`); return; }
    }
    let n = 0;
    if (meta.needsN) {
      n = parseFloat(nText);
      if (!Number.isFinite(n)) { setError('Exponent n must be a valid number.'); return; }
    }

    try {
      let out: ComplexValue;
      switch (op) {
        case 'add': out = addC(z1, z2!); break;
        case 'subtract': out = subC(z1, z2!); break;
        case 'multiply': out = mulC(z1, z2!); break;
        case 'divide': out = divC(z1, z2!); break;
        case 'power': out = powC(z1, n); break;
        case 'sqrt': out = sqrtC(z1); break;
        case 'conjugate': out = conjugate(z1); break;
        case 'inverse': out = reciprocal(z1); break;
        default: out = z1;
      }
      setResult({ z1, z2, out });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const chartData = useMemo(() => {
    if (!result) return null;
    const traces = [
      { x: [0, result.z1.re], y: [0, result.z1.im], mode: 'lines+markers' as const, type: 'scatter' as const, line: { color: '#4f8bff', width: 3 }, marker: { size: [0, 8], color: '#4f8bff' }, name: 'z₁' },
    ];
    if (result.z2) {
      traces.push({ x: [0, result.z2.re], y: [0, result.z2.im], mode: 'lines+markers' as const, type: 'scatter' as const, line: { color: '#37d67a', width: 3 }, marker: { size: [0, 8], color: '#37d67a' }, name: 'z₂' });
    }
    traces.push({ x: [0, result.out.re], y: [0, result.out.im], mode: 'lines+markers' as const, type: 'scatter' as const, line: { color: '#b98cff', width: 3 }, marker: { size: [0, 9], color: '#b98cff' }, name: 'Result' });

    const range = Math.max(4, Math.ceil(Math.max(magnitude(result.z1), magnitude(result.out), result.z2 ? magnitude(result.z2) : 0) + 1));
    const layout = {
      margin: { l: 40, r: 20, t: 20, b: 36 }, paper_bgcolor: colors.paper, plot_bgcolor: colors.paper,
      showlegend: true, legend: { font: { color: colors.text, size: 10 }, orientation: 'h' as const, y: -0.2 },
      xaxis: { range: [-range, range], zeroline: true, zerolinecolor: colors.zero, gridcolor: colors.grid, color: colors.text },
      yaxis: { range: [-range, range], zeroline: true, zerolinecolor: colors.zero, gridcolor: colors.grid, color: colors.text, scaleanchor: 'x' as const, scaleratio: 1 },
      font: { color: colors.text, size: 11 },
    };
    return { traces, layout };
  }, [result, colors]);

  return (
    <Card id="operations">
      <CardHeader><CardTitle>Operations</CardTitle></CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="space-y-1.5">
            <Label>Operation</Label>
            <Select value={op} onValueChange={(v) => setOp(v as OperationType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {OPERATIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>z₁</Label>
            <Input value={z1Text} onChange={(e) => setZ1Text(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && calculate()} />
          </div>
          {meta.needsZ2 && (
            <div className="space-y-1.5">
              <Label>z₂</Label>
              <Input value={z2Text} onChange={(e) => setZ2Text(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && calculate()} />
            </div>
          )}
          {meta.needsN && (
            <div className="space-y-1.5">
              <Label>n (exponent)</Label>
              <Input type="number" step="any" value={nText} onChange={(e) => setNText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && calculate()} />
            </div>
          )}
          {error && <p role="alert" className="text-xs font-medium text-destructive">{error}</p>}
          <Button onClick={calculate}><Calculator className="h-4 w-4" />Calculate</Button>
        </div>

        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          {result ? (
            <>
              <Row label="z₁" value={formatComplex(result.z1)} className="text-chart-blue" />
              {result.z2 && <Row label="z₂" value={formatComplex(result.z2)} className="text-chart-green" />}
              <Row label="Result" value={formatComplex(result.out)} className="text-chart-purple text-base" bold />
              {chartData && (
                <div className="mt-3 h-[220px]">
                  <Plot data={chartData.traces} layout={chartData.layout} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%', height: '100%' }} useResizeHandler />
                </div>
              )}
            </>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">Run a calculation to see the result here.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, className, bold }: { label: string; value: string; className?: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dashed border-border py-2 text-sm last:border-none">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono ${bold ? 'font-bold' : 'font-semibold'} ${className ?? ''}`}>{value}</span>
    </div>
  );
}
