'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Plot from '@/components/complex/plotly-chart';
import { useComplex } from '@/hooks/use-complex';
import { usePlotTheme } from '@/hooks/use-plot-theme';
import { magnitude, argumentDeg } from '@/lib/complex';
import { trimNumber } from '@/lib/utils';

export function PolarPlane() {
  const { z } = useComplex();
  const colors = usePlotTheme();
  const r = magnitude(z);
  const theta = argumentDeg(z);
  const maxR = Math.max(r * 1.3, 1);

  const data = useMemo(
    () => [
      {
        type: 'scatterpolar' as const, mode: 'lines+markers' as const,
        r: [0, r], theta: [theta, theta],
        line: { color: '#ff5c9e', width: 3 }, marker: { size: [0, 9], color: '#ff5c9e' },
        hovertemplate: `r = ${trimNumber(r)}<br>θ = ${trimNumber(theta)}°<extra></extra>`,
      },
    ],
    [r, theta]
  );

  const layout = useMemo(
    () => ({
      margin: { l: 30, r: 30, t: 20, b: 20 },
      paper_bgcolor: colors.paper, plot_bgcolor: colors.paper, showlegend: false,
      polar: { bgcolor: colors.paper, radialaxis: { range: [0, maxR], gridcolor: colors.grid, color: colors.text }, angularaxis: { gridcolor: colors.grid, color: colors.text, direction: 'counterclockwise' as const } },
      font: { color: colors.text, size: 11 },
    }),
    [colors, maxR]
  );

  return (
    <Card id="polar-plane">
      <CardHeader><CardTitle>Polar Plane</CardTitle></CardHeader>
      <CardContent>
        <div className="h-[260px] w-full">
          <Plot data={data} layout={layout} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%', height: '100%' }} useResizeHandler />
        </div>
        <div className="mt-2 flex justify-between font-mono text-sm">
          <span className="text-chart-green">r = <b>{trimNumber(r, 3)}</b></span>
          <span className="text-chart-pink">θ = <b>{trimNumber(theta, 2)}°</b></span>
        </div>
      </CardContent>
    </Card>
  );
}
