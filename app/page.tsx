'use client';

import { useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ComplexInput } from '@/components/complex/complex-input';
import { ComplexPlane } from '@/components/complex/complex-plane';
import { PolarPlane } from '@/components/complex/polar-plane';
import { RepresentationCards } from '@/components/complex/representation-cards';
import { OperationsPanel } from '@/components/complex/operations-panel';
import { TransformationsPanel } from '@/components/complex/transformations-panel';
import { MobiusPanel } from '@/components/complex/mobius-panel';
import { SavedGraphsPanel } from '@/components/complex/saved-graphs-panel';
import { useComplex } from '@/hooks/use-complex';


export default function DashboardPage() {
  const { setZ } = useComplex();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const re = parseFloat(params.get('re') ?? '');
    const im = parseFloat(params.get('im') ?? '');
    if (Number.isFinite(re) && Number.isFinite(im)) setZ({ re, im });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </div>

      <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div id="dashboard">
          <Header />
        </div>

        <div className="mb-6">
          <ComplexInput />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ComplexPlane />
          </div>
          <div>
            <RepresentationCards />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <PolarPlane />
          <div className="lg:col-span-2">
            <div className="h-full rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              Tip: try the quick examples in the sidebar, or type any expression like <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-primary">-3-3i</code> above — every chart on this page updates instantly.
            </div>
          </div>
        </div>

        <div className="mt-6">
          <OperationsPanel />
        </div>

        <div className="mt-6">
          <TransformationsPanel />
        </div>

        <div className="mt-6">
          <MobiusPanel />
        </div>

        <div className="mb-10 mt-6">
          <SavedGraphsPanel />
        </div>

        <footer className="pb-6 text-center text-xs text-muted-foreground">
          CNVT · Complex Number Visualization Tool — Next.js 15 · React 19 · MongoDB
        </footer>
      </main>
    </div>
  );
}
