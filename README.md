# geografa.io

All things maps. Geografa — Vite + React + TypeScript.

## Development

```bash
npm install
cp .env.example .env.local   # add VITE_MAPBOX_ACCESS_TOKEN for map demos
npm run dev      # http://localhost:5173
npm run build    # output to dist/
npm run preview  # preview production build
```

Map demos require a **public** Mapbox access token in `.env.local`. Restrict it to your domain in the [Mapbox dashboard](https://account.mapbox.com/access-tokens/).

## Project structure

```
src/
  theme/          # Brand colors + map palette (single source of truth)
  components/     # Layout, UI, section, and map demo components
  demos/          # Interactive map demos (React Router routes)
  hooks/          # useMapbox and other shared hooks
  lib/map/        # GeoJSON sources, line layers, map defaults
  config/         # Env helpers (Mapbox token)
  data/site.ts    # Landing page content
  styles/         # Global CSS + map demo chrome
public/
  img/            # Static assets
  demos/          # Demo GeoJSON and other fetch assets
  mexico/         # Static CDMX trip page (not React)
```

## Map colors

Import shared map tokens in any map component:

```ts
import { mapColors, mapPaint } from "@/theme";
```

See [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) for full token and component documentation.

## Deploy

Pushes to `main`/`master` trigger [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds and deploys `dist/` to GitHub Pages.

**One-time setup:**

1. Repo **Settings → Pages → Build and deployment → Source** must be **GitHub Actions** (not “Deploy from a branch”). If Pages serves the repo root, the browser loads `/src/main.tsx` and fails with a MIME type error.
2. Repo **Settings → Secrets and variables → Actions** — add `VITE_MAPBOX_ACCESS_TOKEN` so map demos work in production (Vite inlines this at build time).

Custom domain `geografa.io` is included via `public/CNAME`. `public/.nojekyll` disables Jekyll processing so `/assets/*.js` is served correctly.
