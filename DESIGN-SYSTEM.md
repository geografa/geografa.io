# Geografa design system

**Warm paper** — an editorial layout system for Geografa marketing pages. Serif headlines, Oswald labels, and a sage-and-parchment palette with pale gold accents. Reads like a well-typeset document, not a typical SaaS landing page.

**Primary implementation:** React app in [`src/`](src/)  
**Theme tokens:** [`src/theme/colors.ts`](src/theme/colors.ts) (canonical) → injected as CSS vars + [`src/styles/global.css`](src/styles/global.css)  
**Map palette:** [`src/theme/mapColors.ts`](src/theme/mapColors.ts)  
**Sibling reference:** [`public/mexico/index.html`](public/mexico/index.html) — static page; may lag behind token updates

```bash
npm run dev    # local development
npm run build  # production bundle → dist/
```

---

## Principles

1. **Editorial hierarchy** — Numbered section labels, serif titles, and Oswald metadata create a magazine-like rhythm.
2. **Warm contrast** — Dark ink sections alternate with cream and green backgrounds; pale gold ties accents together.
3. **Human-centered** — Copy and layout prioritize the people who use maps — their needs, contexts, and workflows.
4. **Restraint** — Light font weights, generous line-height, and subtle borders. Shadows only on hover or photos.
5. **Readable density** — Body copy at 13–15px; labels use letter-spacing and uppercase instead of size for emphasis.

---

## Color tokens

All colors are defined in [`src/theme/colors.ts`](src/theme/colors.ts) and applied at runtime via `applyTheme()` in [`src/main.tsx`](src/main.tsx). CSS uses matching custom properties on `:root`.

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#162321` | Primary text, dark section backgrounds, nav, footer |
| `--cream` | `#f4f1de` | Page background, hero headline text on dark |
| `--gold` | `#eee9c5` | Labels on dark, links, accents, primary buttons |
| `--gold-light` | `#eaeca3` | Hover states, italic emphasis, nav wordmark |
| `--green` | `#2d5a3d` | Testimonial / accent section background |
| `--red` | `#e07a5f` | Reserved for emphasis (e.g. match-day headings on Mexico page) |
| `--muted` | `#40564b` | Body copy and dark section labels on cream |
| `--card-bg` | `#fffdf8` | Card surfaces — slightly lighter than cream |
| `--border` | `#142623` | Dividers, card borders, label rules on light backgrounds |

### Semantic usage

| Context | Background | Text |
| --- | --- | --- |
| Default page | `--cream` | `--ink` |
| Dark section (`.ink-bg`) | `--ink` | `--cream` |
| Green section (`.transit-bg`) | `--green` | `--cream` |
| Cards on cream | `--card-bg` | `--ink` / `--muted` |
| Cards on ink | `rgba(201, 147, 58, 0.06)` | `--cream` at ~65–85% opacity |

### Overlays and transparency

On dark sections, secondary text uses `rgba(245, 240, 232, 0.6–0.7)`. Nav links use `rgba(245, 240, 232, 0.4)` at rest and `--gold-light` on hover.

Nav bar background: `rgba(14, 22, 24, 0.92)` + `backdrop-filter: blur(12px)`.

Hero video overlay stacks an ink gradient (`rgba(14, 22, 24, 0.75–0.92)`) with a radial lime-gold glow and a 40px grid at ~4% opacity.

`theme-color` for mobile browser chrome: `#1a1208` (update to `#162321` when meta tags are synced).

---

## Typography

### Font stack

Loaded from Google Fonts:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&family=Oswald:wght@200..700&display=swap"
  rel="stylesheet"
/>
```

| Font | Role |
| --- | --- |
| **Playfair Display** | Headlines, card titles, signatures, `<em>` emphasis in section titles |
| **DM Sans** | Body copy (weights 300, 400, 500) |
| **Oswald** | Labels, tags, buttons, nav, metadata, footer (weights 200–700) |

### Type roles

| Role | Font | Weight | Size | Notes |
| --- | --- | --- | --- | --- |
| Hero headline | Playfair Display | 900 | `clamp(2.5rem, 8vw, 5.5rem)` | `--cream`; line-height 1.0 |
| Hero emphasis | Playfair Display | italic | — | `--gold-light`; optional second line in `<em>` |
| Section title | Playfair Display | 700 | `clamp(2rem, 5vw, 3.2rem)` | Line-height 1.1 |
| Section label (dark bg) | Oswald | 400 | 10px | Uppercase; `--gold`; rule line `rgba(201, 147, 58, 0.25)` via `.ink-bg` |
| Section label (light bg) | Oswald | 400 | 10px | `.section-label--dark` → `--muted` text, `--border` rule |
| Hero tag | Oswald | 400 | 11px | Uppercase; may include inline logo `<img>` at 12px height |
| Nav wordmark | Oswald | 400 | 14px | Uppercase; `--gold-light`; `letter-spacing: 0.15em` |
| Nav links | Oswald | 400 | 12px | Uppercase; `letter-spacing: 0.25em` |
| Body / intro | DM Sans | 300 | 15px | Line-height 1.7–1.75 |
| Card body | DM Sans | 300 | 13px | `--muted` on cream |
| Tags / links | Oswald | 400 | 9–12px | Uppercase, tracked |
| Footer | Oswald | 400–500 | 10px | `--gold` for emphasis |

### Section label variants

Base class `.section-label` — flex row with a extending rule via `::after`:

| Modifier / context | Label color | Rule (`::after`) |
| --- | --- | --- |
| Default (dark sections) | `--gold` | `--border` |
| `.section-label--dark` (cream sections) | `--muted` | `--border` |
| Inside `.ink-bg` | `--gold` | `rgba(201, 147, 58, 0.25)` |
| Inside `.transit-bg` | `rgba(245, 240, 232, 0.5)` | `rgba(245, 240, 232, 0.15)` |

Numbered motif example: `01 · The work`

---

## Layout

| Property | Value |
| --- | --- |
| Content max-width | `960px` (`.section`) |
| Section padding | `5rem 2rem` |
| Nav height | `48px` |
| Body offset | `padding-top: 48px` |
| Scroll padding | `scroll-padding-top: 56px` |
| Grid gaps | `1.25rem` (cards) · `1.5rem` (nav, footer links) |
| Border radius | `8px` chips · `10px` buttons/pills · `12px` cards · `16px` large cards |

### Section backgrounds

Pages alternate cream (default), ink (`.ink-bg`), and green (`.transit-bg`) bands, separated by `<hr class="divider">` (1px `--border`).

Landing page section map:

| Section | Background | Label class |
| --- | --- | --- |
| Hero | `--ink` + video | — |
| 01 · The work | `.ink-bg` | `.section-label` |
| 02 · Selected work | cream | `.section-label--dark` |
| 03 · How we work | cream | `.section-label--dark` |
| 04 · Kind words | `.transit-bg` | `.section-label` |
| 05 · About | cream | `.section-label--dark` |
| 06 · Get in touch | `.ink-bg` | `.section-label` |

---

## Components

### Navigation (`nav`)

- Fixed top bar, `z-index: 100`
- Logo: SVG mark + Oswald uppercase wordmark (`eografa`) in `--gold-light`
- Links: uppercase Oswald, muted cream, `--gold-light` on hover
- **Mobile (≤640px):** `.nav-links` hidden

### Hero (`.hero`)

Full-viewport intro on `--ink`. Landing page layers:

- `.hero-video-wrap` — full-bleed `<video autoplay muted loop playsinline>` with `object-fit: cover`
- `.hero-overlay` — ink gradient + radial glow + 40px grid
- `.hero-content` — centered, `max-width: 720px`, `z-index: 1`
- `.hero-tag` — optional inline logo before tagline text
- `.scroll-hint` — bottom-centered Oswald text with `pulse` animation (2s ease-in-out)

Mexico page uses a static hero with the grid in `::before` instead of video.

### Buttons

| Class | Style |
| --- | --- |
| `.btn-primary` | `--gold` fill, `--ink` text, `border-radius: 10px` |
| `.btn-ghost` | Transparent, `--gold-light` text, gold-tint border |
| `.contact-pill` | Ghost pill, `border-radius: 10px` |
| `.contact-pill.primary` | Gold fill for email CTA; mixed case allowed |

All use Oswald, uppercase (except `.contact-pill.primary` email), 0.2s transitions.

### Section shell

```html
<!-- Cream section -->
<div class="section">
  <div class="section-label section-label--dark">02 · Selected work</div>
  <h2 class="section-title">Headline here.</h2>
</div>

<!-- Dark section -->
<div class="ink-bg">
  <div class="section">
    <div class="section-label">01 · The work</div>
    <h2 class="section-title">Headline here.</h2>
  </div>
</div>
```

Intro paragraphs: `.section-intro` (on ink) or `.about-intro` (on cream).

### Service cards (`.service-card`)

Inside `.ink-bg`. Grid: `repeat(auto-fit, minmax(260px, 1fr))`. Gold-tinted surface on ink; Playfair title + 13px body.

### Work cards (`.work-card`)

`.work-featured-grid` — 3 columns, 1 on mobile. Image top (160px). `.work-tag` (Oswald), `.work-link` (Oswald, `--ink` text with underline).

### Archive chips (`.work-chip`)

Flex-wrap row; 36×36 thumbnail + label. Hover: gold-tint border and background.

### Approach card (`.approach-card`)

Two-column grid (prose + photo). `.approach-signature` — Playfair italic. Stacks single-column at ≤768px.

### Quote cards (`.quote-card`)

Inside `.transit-bg`. Left `--gold` border (3px), italic blockquote, Oswald author + muted role.

### Timeline (`.timeline`)

Bordered card stack. `.timeline-date` — Oswald, `--ink`, 12px. `.timeline-title` — Playfair. Date column stacks above content at ≤640px.

### Contact (`.contact-section`)

Centered in `.ink-bg`. Title `<em>` in `--gold-light`. Pills in `.contact-links`.

### Footer (`.footer`)

`--ink` background, centered Oswald. `.footer-links` echo nav. Tagline: *made on warm paper*.

---

## Motion

| Name | Usage |
| --- | --- |
| `pulse` | Scroll hint opacity (0.3 ↔ 0.8, 2s infinite) |
| `transition: 0.2s` | Links, buttons, chips, work-card shadow |

No page-load animations. Hover states only.

---

## Responsive breakpoints

| Breakpoint | Behavior |
| --- | --- |
| `≤768px` | Featured work grid → 1 column; approach card → single column |
| `≤640px` | Nav links hidden; timeline date stacks; hero CTAs stack vertically |

Typography scales via `clamp()` on hero and section titles.

---

## Grid motif

Hero overlay and Mexico static hero use a **40px grid** from two `repeating-linear-gradient` layers (~4% opacity) plus a radial glow. Reads as graph paper on warm paper — mapping without literal map UI.

---

## Map colors (React)

Map-specific tokens live in [`src/theme/mapColors.ts`](src/theme/mapColors.ts), derived from brand colors:

```ts
import { mapColors, mapPaint } from "@/theme";

// Use in Mapbox GL / MapLibre style layers
map.addLayer({
  id: "water",
  type: "fill",
  paint: { "fill-color": mapColors.water },
});

// Or use pre-built paint expressions
paint: { "fill-color": mapPaint.landFill[1] }
```

| Token | Default | Use |
| --- | --- | --- |
| `background` | cream | Map canvas / page backdrop |
| `land` | muted | Land fill, parks |
| `water` | ink | Water bodies |
| `accent` | gold | Routes, highlights |
| `highlight` | goldLight | Active/selected features |
| `boundary` | border | Admin lines, borders |
| `label` | ink | Text labels |

---

## Map demos

Interactive portfolio demos live in the same Vite SPA as the landing page. Each demo gets a React Router path under `/portfolio/…` and can use shared map primitives.

### Environment

```bash
cp .env.example .env.local
# VITE_MAPBOX_ACCESS_TOKEN=pk.your_token_here
```

Vite exposes only `VITE_*` variables to the client. Read the token via [`src/config/env.ts`](src/config/env.ts) (`getMapboxToken()`). Use a **public** token with URL restrictions in Mapbox — it will appear in the built bundle.

### Shared components

| Component | Path | Purpose |
| --- | --- | --- |
| `MapDemoShell` | `components/map/MapDemoShell.tsx` | Full-viewport demo layout with back link |
| `MapCanvas` | `components/map/MapCanvas.tsx` | Map container wired to `useMapbox` |
| `MapSidebar` | `components/map/MapSidebar.tsx` | Floating control panel |
| `MapSlider` / `MapToggle` | `components/map/` | Paint and layout controls |
| `MapCopyButton` | `components/map/MapCopyButton.tsx` | Copy paint JSON to clipboard |
| `MapMarker` / `MapPopup` | `components/map/` | Marker and popup helpers |
| `MapAttribution` | `components/map/MapAttribution.tsx` | Nav + attribution controls |

Styles: [`src/styles/map-demo.css`](src/styles/map-demo.css). Import `mapbox-gl/dist/mapbox-gl.css` once in [`src/main.tsx`](src/main.tsx).

### Hooks and helpers

- [`src/hooks/useMapbox.ts`](src/hooks/useMapbox.ts) — create/destroy Mapbox map, light preset on load
- [`src/lib/map/layers.ts`](src/lib/map/layers.ts) — `fetchGeoJSON`, `addGeoJSONSource`, `addLineLayer`, paint helpers
- [`src/lib/map/defaults.ts`](src/lib/map/defaults.ts) — style URL, shared viewports

### Adding a demo

1. Put static assets in `public/demos/{name}/` (GeoJSON, thumbnails).
2. Create `src/demos/{name}/{Name}Demo.tsx` using `MapDemoShell` + `MapCanvas`.
3. Register a route in [`src/App.tsx`](src/App.tsx).
4. Optional: add an archive chip in [`src/data/site.ts`](src/data/site.ts) with an internal `href`.

Example: [`src/demos/simple-line-designer/`](src/demos/simple-line-designer/) at `/portfolio/simple-line-designer`.

GitHub Pages deep links: the build copies `index.html` → `404.html` so client-side routes resolve on refresh.

---

## React components

| Component | Path | Purpose |
| --- | --- | --- |
| `Section` | `components/layout/Section.tsx` | Shell + background variant (`cream` \| `ink` \| `green`) |
| `SectionLabel` | `components/layout/SectionLabel.tsx` | Numbered label with rule line |
| `Nav` / `Footer` | `components/layout/` | Site chrome |
| `Button` | `components/ui/Button.tsx` | Primary / ghost CTAs |
| `WorkCard` / `WorkChip` | `components/ui/` | Portfolio items |
| Map demo components | `components/map/` | Shared map demo shell, canvas, sidebar, controls |
| Section components | `components/sections/` | Hero, Work, SelectedWork, etc. |

Content is driven by [`src/data/site.ts`](src/data/site.ts) — edit data, not markup, to update copy or portfolio items.

---

## Adding a new section

1. Add content to [`src/data/site.ts`](src/data/site.ts).
2. Create a section component in `src/components/sections/`.
3. Compose with `<Section variant="cream|ink|green" label="…">`.
4. Import colors for map features from `@/theme` — do not hardcode hex values.

Static pages (e.g. Mexico trip) can remain in `public/` as plain HTML.

---

## Future work

- Generate `global.css` `:root` from `colors.ts` at build time
- Migrate [`public/mexico/index.html`](public/mexico/index.html) to React
- Remove duplicate [`mexico/index.html`](mexico/index.html) at repo root
- Favicon paths reference `/img/favicon.ico`; assets live under `public/img/favicon_io/`
