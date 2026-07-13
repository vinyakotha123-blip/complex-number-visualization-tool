'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useComplex } from '@/hooks/use-complex';
import {
  formatComplex, formatPolar, formatExponential, formatTrig,
  magnitude, argumentDeg, argumentRad, conjugate, reciprocal,
} from '@/lib/complex';
import { trimNumber } from '@/lib/utils';
import type { RepresentationType } from '@/types';

const REP_TABS: { key: RepresentationType; label: string; hint: string }[] = [
  { key: 'rectangular', label: 'Rectangular', hint: 'a + bi' },
  { key: 'polar', label: 'Polar', hint: 'r(cosθ + i sinθ)' },
  { key: 'exponential', label: 'Exponential', hint: 're^iθ' },
  { key: 'trig', label: 'Trig Form', hint: 'r·cis(θ)' },
];

export function RepresentationCards() {
  const { z } = useComplex();
  const [active, setActive] = useState<RepresentationType>('rectangular');

  const mag = magnitude(z);
  const argDeg = argumentDeg(z);
  const argRad = argumentRad(z);
  const conj = conjugate(z);

  let recipStr = 'undefined (z = 0)';
  try { recipStr = formatComplex(reciprocal(z)); } catch {}

  const repOutput = {
    rectangular: `z = ${formatComplex(z)}`,
    polar: `z = ${formatPolar(z)}`,
    exponential: `z = ${formatExponential(z)}`,
    trig: `z = ${formatTrig(z)}`,
  }[active];

  return (
    <Card>
      <CardHeader><CardTitle>Representations</CardTitle></CardHeader>
      <CardContent>
        <Tabs value={active} onValueChange={(v) => setActive(v as RepresentationType)}>
          <TabsList>
            {REP_TABS.map((t) => (
              <TabsTrigger key={t.key} value={t.key}>
                {t.label}
                <span className="block font-normal text-[10px] text-muted-foreground/80">{t.hint}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={active}>
            <div className="rounded-xl border border-border bg-secondary/40 p-4 font-mono text-base font-semibold text-chart-purple break-words">
              {repOutput}
            </div>
          </TabsContent>
        </Tabs>

        <h3 className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Value Details</h3>
        <dl className="flex flex-col">
          <Row label="Complex Number" value={`z = ${formatComplex(z)}`} className="text-chart-blue" />
          <Row label="Magnitude |z|" value={trimNumber(mag, 3)} className="text-chart-green" />
          <Row label="Argument arg(z)" value={`${trimNumber(argDeg, 2)}°`} className="text-chart-pink" />
          <Row label="Argument (rad)" value={trimNumber(argRad, 4)} className="text-chart-pink" />
          <Row label="Conjugate z̄" value={formatComplex(conj)} className="text-chart-orange" />
          <Row label="Reciprocal 1/z" value={recipStr} className="text-chart-purple" />
        </dl>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dashed border-border py-2 text-sm last:border-none">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`font-mono font-semibold ${className ?? ''}`}>{value}</dd>
    </div>
  );
}
