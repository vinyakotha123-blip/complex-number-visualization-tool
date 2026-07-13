import type { ComplexValue } from '@/types';
import { formatComplex, formatPolar, formatExponential, magnitude, argumentDeg, argumentRad, conjugate } from '@/lib/complex';

/** Downloads the Plotly chart with the given DOM id as a PNG. */
export async function exportChartAsPng(elementId: string, filename = 'cnvt-chart.png') {
  const Plotly = (await import('plotly.js')) as any;
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Chart element not found.');
  const url = await Plotly.toImage(el, { format: 'png', width: 1000, height: 800 });
  triggerDownload(url, filename);
}

/** Downloads the Plotly chart with the given DOM id as a PDF (image embedded in a PDF page). */
export async function exportChartAsPdf(elementId: string, filename = 'cnvt-chart.pdf') {
  const Plotly = (await import('plotly.js')) as any;
  const { jsPDF } = await import('jspdf');
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Chart element not found.');
  const dataUrl: string = await Plotly.toImage(el, { format: 'png', width: 1000, height: 800 });
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [1000, 800] });
  pdf.addImage(dataUrl, 'PNG', 0, 0, 1000, 800);
  pdf.save(filename);
}

/** Downloads a JSON snapshot of the current complex number's calculations. */
export function exportJson(z: ComplexValue, filename = 'cnvt-export.json') {
  const data = {
    complexNumber: formatComplex(z),
    real: z.re,
    imaginary: z.im,
    magnitude: magnitude(z),
    argumentDegrees: argumentDeg(z),
    argumentRadians: argumentRad(z),
    conjugate: formatComplex(conjugate(z)),
    polarForm: formatPolar(z),
    exponentialForm: formatExponential(z),
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
