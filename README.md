# CNVT — Complex Number Visualization Tool

A premium, Desmos-style dashboard for visualizing and exploring complex numbers, built with Next.js 15, React 19, TypeScript, Tailwind CSS, Plotly.js, math.js, Framer Motion, shadcn-style UI, and MongoDB.

## Features

- Interactive Cartesian complex plane: vector, magnitude circle, projection lines, zoom/reset
- Shareable deep links that preserve the current complex number in the URL and can be reset instantly
- Interactive polar plane with animated radius/angle pointer
- Rectangular, Polar, Exponential and Trig representations, updating instantly
- Full calculations: real/imaginary parts, magnitude, argument (deg & rad), conjugate, reciprocal
- Operations: addition, subtraction, multiplication, division, power, square root, conjugate, inverse
- Transformations: translation, rotation, scaling, reflection — with animation
- Möbius transform (w = (az+b)/(cz+d)) with live grid-mapping visualization
- Save / rename / delete / reload graphs, persisted in MongoDB via REST API routes
- Export current plane as PNG or PDF, or export the full calculation set as JSON
- Dark / light theme toggle with a dark-purple SaaS aesthetic
- Fully responsive, keyboard accessible, ARIA-labeled

## Getting started

```bash
npm install
cp .env.local.example .env.local
# then edit .env.local and set MONGODB_URI to your MongoDB connection string
npm run dev
```

Open http://localhost:3000.

You'll need a MongoDB instance — either a local `mongod`, or a free cluster at
[MongoDB Atlas](https://www.mongodb.com/atlas). Saved Graphs won't load or save
until `MONGODB_URI` is set correctly in `.env.local`.

## Folder structure

```
app/                     Next.js App Router pages & API routes
  api/graphs/            REST endpoints backed by MongoDB (list/create)
  api/graphs/[id]/       REST endpoints for a single graph (get/update/delete)
  layout.tsx             Root layout: fonts, providers, toaster
  page.tsx               Dashboard page composing every panel
  globals.css            Tailwind layers + dark-purple theme tokens
components/
  ui/                    shadcn-style primitives (button, card, input, select, tabs, switch, dialog, badge, toaster)
  layout/                Sidebar and Header
  complex/               All complex-number panels (plane, polar, operations, transforms, möbius, saved graphs)
  providers/             React context providers (theme, complex-number state)
lib/
  complex.ts             Complex-number engine built on math.js
  mongodb.ts             Cached mongoose connection helper
  validation.ts          Zod schemas for API validation
  utils.ts               cn() class merge + number formatting helpers
hooks/                   useComplex, useTheme, useSavedGraphs, useToast, usePlotTheme
utils/                   export.ts — PNG/PDF/JSON export helpers
models/                  Mongoose schema for saved graphs
types/                   Shared TypeScript types
```

## Tech notes

- All complex arithmetic (add/subtract/multiply/divide/power/sqrt/exp/log/sin/cos/conjugate)
  is delegated to **math.js**, not reimplemented or faked.
- `react-plotly.js` is dynamically imported with `ssr: false` since Plotly touches
  `window` — required for the App Router.
- The REST API validates every request body with **zod** and returns structured
  JSON errors (`{ error, details }`) with correct HTTP status codes (400/422/404/500).
- Mongoose connections are cached on the Node.js global object to survive
  Next.js hot-reload and serverless cold starts without exhausting connections.
