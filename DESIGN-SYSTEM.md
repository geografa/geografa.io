# Geografa design system

**Warm paper** — an editorial layout system for Geografa marketing pages. It pairs serif headlines, mono labels, and a cream-and-ink palette with gold accents. The system reads like a well-typeset document rather than a typical SaaS landing page.

**Primary implementation:** [`index.html`](index.html)  
**Sibling reference:** [`mexico/index.html`](mexico/index.html) — same tokens and patterns, plus trip-specific components (itinerary, flights, Mapbox map)

Styles live inline in each HTML file. There is no shared CSS bundle yet.

---

## Principles

1. **Editorial hierarchy** — Numbered section labels, serif titles, and mono metadata create a magazine-like rhythm.
2. **Warm contrast** — Dark ink sections alternate with cream and green backgrounds; gold ties the palette together.
3. **Restraint** — Light font weights, generous line-height, and subtle borders. No heavy shadows except on hover or photos.
4. **Human-readable density** — Body copy stays at 13–15px; labels use wide letter-spacing instead of size for emphasis.

---

## Color tokens

All colors are CSS custom properties on `:root`.

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#1a1208` | Primary text, dark section backgrounds, nav, footer |
| `--cream` | `#f5f0e8` | Page background, hero headline text on dark |
| `--gold` | `#c9933a` | Labels, links, accents, primary buttons |
| `--gold-light` | `#e8b865` | Hover states, italic emphasis, nav logo |
| `--green` | `#2d5a3d` | Testimonial / accent section background |
| `--red` | `#b83232` | Reserved for emphasis (e.g. match-day headings in Mexico page) |
| `--muted` | `#6b5f4e` | Body copy on cream backgrounds |
| `--card-bg` | `#fffdf8` | Card surfaces — slightly lighter than cream |
| `--border` | `rgba(201, 147, 58, 0.25)` | Dividers, card borders, label rules |

### Semantic usage

| Context | Background | Text |
| --- | --- | --- |
| Default page | `--cream` | `--ink` |
| Dark section (`.ink-bg`) | `--ink` | `--cream` |
| Green section (`.transit-bg`) | `--green` | `--cream` |
| Cards on cream | `--card-bg` | `--ink` / `--muted` |
| Cards on ink | `rgba(201, 147, 58, 0.06)` | `--cream` at ~65–85% opacity |

### Overlays and transparency

On dark sections, secondary text typically uses `rgba(245, 240, 232, 0.6–0.7)`. Nav links use `rgba(245, 240, 232, 0.4)` at rest, `--gold-light` on hover.

`theme-color` for mobile browser chrome: `#1a1208`.

---

## Typography

### Font stack

Loaded from Google Fonts:

```
Playfair Display — headlines, card titles, signatures
DM Sans         — body copy (weights 300, 400, 500)
DM Mono         — labels, tags, buttons, metadata, footer
```

### Roles

| Role | Font | Weight | Size | Notes |
| --- | --- | --- | --- | --- |
| Hero headline | Playfair Display | 900 | `clamp(2.5rem, 8vw, 5.5rem)` | `--cream` on dark; tight line-height (1.0) |
| Hero emphasis | Playfair Display | italic | — | `--gold-light`; often on its own line |
| Section title | Playfair Display | 700 | `clamp(2rem, 5vw, 3.2rem)` | Line-height 1.1 |
| Section label | DM Mono | 400 | 10px | Uppercase, `letter-spacing: 0.25em`, gold |
| Hero tag | DM Mono | 400 | 11px | Uppercase, `letter-spacing: 0.2em` |
| Body / intro | DM Sans | 300 | 15px | Line-height 1.7–1.75 |
| Card body | DM Sans | 300 | 13px | `--muted` on cream |
| Tags / links | DM Mono | 400 | 9–11px | Uppercase, tracked |
| Nav links | DM Mono | 400 | 9px | Uppercase, `letter-spacing: 0.15em` |
| Footer | DM Mono | 400–500 | 10px | `--gold` for emphasis |

### Label rule

`.section-label` includes a flex-grow `::after` pseudo-element — a 1px gold-tinted line extending to the right edge. This is the signature “numbered section” motif (`01 · The work`).

---

## Layout

| Property | Value |
| --- | --- |
| Content max-width | `960px` (`.section`) |
| Section padding | `5rem 2rem` vertical/horizontal |
| Nav height | `48px` |
| Body offset | `padding-top: 48px` for fixed nav |
| Scroll padding | `scroll-padding-top: 56px` for anchor links |
| Grid gaps | `1.25rem` (cards), `1.5rem` (nav links, footer links) |
| Border radius | `8px` chips · `12px` cards · `16px` large cards · `100px` pills |

### Section backgrounds

Pages alternate between cream, ink, and green bands, separated by `<hr class="divider">` (1px `--border`).

---

## Components

### Navigation (`nav`)

- Fixed top bar, `z-index: 100`
- Background: `rgba(26, 18, 8, 0.92)` + `backdrop-filter: blur(12px)`
- Logo: SVG mark + Playfair italic “Geografa” in `--gold-light`
- Links: uppercase mono, muted cream, gold on hover
- **Mobile (≤640px):** `.nav-links` hidden

### Hero (`.hero`)

Full-viewport intro on `--ink`. Landing page adds:

- `.hero-video-wrap` — full-bleed `<video>` with `object-fit: cover`
- `.hero-overlay` — ink gradient + radial gold glow + 40px grid (same motif as Mexico static hero)
- `.hero-content` — centered, `max-width: 720px`, `z-index: 1`
- `.scroll-hint` — bottom-centered mono text with `pulse` animation (2s ease-in-out)

Mexico page uses a static hero with the grid baked into `::before` instead of video.

### Buttons

| Class | Style |
| --- | --- |
| `.btn-primary` | Gold fill, ink text, pill shape |
| `.btn-ghost` | Transparent, gold-light text, gold border |
| `.contact-pill` | Ghost pill for contact links |
| `.contact-pill.primary` | Gold fill for email CTA |

All buttons/links use DM Mono, uppercase (except `.contact-pill.primary`), `border-radius: 100px`, 0.2s transitions.

### Section shell

```html
<div class="section">
  <div class="section-label">01 · The work</div>
  <h2 class="section-title">Headline here.</h2>
  <!-- content -->
</div>
```

Optional intro paragraphs: `.section-intro` (on ink) or `.about-intro` (on cream).

### Service cards (`.service-card`)

Used inside `.ink-bg`. Grid: `repeat(auto-fit, minmax(260px, 1fr))`.

- Subtle gold-tinted background and border on ink
- Playfair title + 13px muted body

### Work cards (`.work-card`)

Featured portfolio items in `.work-featured-grid` (3 columns → 1 on mobile).

- Image top (`160px` height, `object-fit: cover`)
- `.work-tag` — mono category label
- `.work-link` — underlined mono “Open project →”

### Archive chips (`.work-chip`)

Compact linked rows with 36×36 thumbnail + label. Flex-wrap grid for secondary portfolio items.

### Approach card (`.approach-card`)

Two-column grid: prose + photo. Cream card, 16px radius. Signature line uses `.approach-signature` (Playfair italic).

### Quote cards (`.quote-card`)

Inside `.transit-bg` (green). Left gold border (3px), italic blockquote, mono author + muted role.

### Timeline (`.timeline`)

Stacked rows in a bordered card. Each `.timeline-row` is a 140px date column + content column. Date in gold mono; title in Playfair.

### Contact (`.contact-section`)

Centered inside `.ink-bg`. Title may use `<em>` for gold-light italic phrase. Pills in `.contact-links`.

### Footer (`.footer`)

Ink background, centered mono text. `.footer-links` echo nav. Tagline: *made on warm paper*.

---

## Motion

| Name | Usage |
| --- | --- |
| `pulse` | Scroll hint opacity fade (0.3 ↔ 0.8, 2s infinite) |
| `transition: 0.2s` | Links, buttons, chips, work-card shadow |

No page-load animations. Hover states only.

---

## Responsive breakpoints

| Breakpoint | Behavior |
| --- | --- |
| `≤768px` | Featured work grid → 1 column; approach card → single column |
| `≤640px` | Nav links hidden; timeline date stacks above content; hero CTAs stack vertically |

Typography scales via `clamp()` on hero and section titles — no breakpoint overrides needed for type.

---

## Grid and map motifs

The hero overlay (and Mexico static hero) use a **40px gold grid** built from two `repeating-linear-gradient` layers at 4% opacity, plus a radial gold ellipse at 12% opacity. This reads as “graph paper on warm paper” and connects the brand to mapping without literal map UI.

---

## Adding a new page

1. Copy the `:root` tokens and base reset from `index.html` or `mexico/index.html`.
2. Include the three Google Fonts weights in `<head>`.
3. Use `nav` + `.section` + `.section-label` + `.section-title` for structure.
4. Pick a section background: default cream, `.ink-bg`, or `.transit-bg`.
5. Reuse card patterns from the component list above.
6. Set `theme-color` to `#1a1208`.
7. Account for fixed nav: `body { padding-top: 48px }` and `html { scroll-padding-top: 56px }`.

---

## Future work

- Extract shared tokens and components into a single `css/warm-paper.css` to avoid duplication between `index.html` and `mexico/index.html`
- Favicon paths currently reference `/img/favicon.ico`; assets live under `img/favicon_io/`
