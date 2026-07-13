'use client';

import dynamic from 'next/dynamic';

// react-plotly.js touches `window` at import time, so it must never be
// evaluated during server-side rendering.
const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
      Loading chart…
    </div>
  ),
});

export default Plot;
