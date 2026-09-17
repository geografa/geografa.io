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

Pushes to `main`/`master` trigger [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which runs `npm run build` and deploys **`dist/`** to GitHub Pages via Actions.

### One-time setup

1. **Settings → Pages → Build and deployment → Source** → **GitHub Actions**  
   Do **not** use “Deploy from a branch.” Branch deploys publish the Vite source tree; Actions must be the only publish source.
2. **Settings → Secrets and variables → Actions** → add `VITE_MAPBOX_ACCESS_TOKEN`  
   Vite inlines this at build time so map demos work in production. Use a public token restricted to `geografa.io` in the [Mapbox dashboard](https://account.mapbox.com/access-tokens/).

Custom domain `geografa.io` ships via `public/CNAME`. `public/.nojekyll` disables Jekyll so `/assets/*.js` paths are not stripped.

### Verify a good deploy

After Actions finishes, view source on https://geografa.io/ — you should see a hashed bundle, not the Vite entry:

```html
<script type="module" src="/assets/index-….js"></script>
```

Not this (broken):

```html
<script type="module" src="/src/main.tsx"></script>
```

### Troubleshooting: MIME type / blank site

**Symptom:** console error like `Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream"`.

**Cause:** Pages is serving `/src/main.tsx` from the repo root. GitHub serves `.tsx` as `application/octet-stream`, which browsers reject for `type="module"`. You’ll also see `/assets/*.js` 404, and Actions may show both **Deploy to GitHub Pages** (good) and **pages build and deployment** (branch publish overwriting it).

**Fix:** Set Pages **Source** to **GitHub Actions**, then re-run the Deploy workflow (or push an empty commit). Confirm view-source shows `/assets/index-….js`.
