import type {
  ArchiveChip,
  NavLink,
  Service,
  Testimonial,
  TimelineEntry,
  WorkItem,
} from "@/types/content";

export const siteMeta = {
  title: "Geografa · Web map support",
  description:
    "Twenty years of geospatial work — web map support at the ready. Geografa helps teams ship maps that hold up under pressure.",
  themeColor: "#162321",
};

export const navLinks: NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "Archive", href: "https://geografa.github.io/portfolio/", external: true },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const footerLinks: NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "Archive", href: "https://geografa.github.io/portfolio/", external: true },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
  { label: "GitHub", href: "https://github.com/geografa", external: true },
  { label: "Email", href: "mailto:rafa@geografa.io" },
];

export const hero = {
  tagline: "eografa · est. 2001 · Portland, OR",
  title: "Human-centered map design",
  subtitle:
    "Over twenty five years of geospatial work in one collective. We're web mapping experts, GIS professionals, and web developers helping teams ship maps that hold up under pressure.",
  primaryCta: { label: "See the work →", href: "#selected" },
  secondaryCta: { label: "Start a conversation", href: "#contact" },
  videoSrc: "/img/maphero.mp4",
};

export const workSection = {
  label: "01 · The work",
  title: "A small studio that scales like a collective.",
  intro:
    "Geografa runs lean by default and assembles the right team from a trusted network of engineers, designers, and developers. You're connected with one project manager so support and continuity stay high-touch.",
};

export const services: Service[] = [
  {
    title: "Optimization",
    description:
      "Slow tiles, heavy bundles, jittery interactions — we audit your stack and bring map performance back into spec. Vector tile pipelines, style refactors, render budgets.",
  },
  {
    title: "Custom map products",
    description:
      "From a single embed to a full application — Mapbox GL, MapLibre, Three.js, vector tiles, custom geocoding, geofencing, 3D models. Delivered as code your team can own.",
  },
  {
    title: "Strategy & advisory",
    description:
      'Choosing a basemap provider, scoping a migration, hiring your first geo engineer. Twenty years of "I\'ve seen this before" is applied to the decisions that matter most.',
  },
];

export const selectedWorkSection = {
  label: "02 · Selected work",
  title: "Maps in production, and a few in the wild.",
  intro:
    "A mix of client work and personal experiments — most of the experiments end up teaching us something we use the next time around.",
  archiveLabel: "More from the archive",
  archiveCta: {
    label: "Browse the full archive →",
    href: "https://geografa.github.io/portfolio/",
  },
};

export const featuredWork: WorkItem[] = [
  {
    image: "/img/uber.png",
    imageAlt: "Uber Design",
    tag: "Navigation · Maplibre GL",
    title: "Uber Map Design",
    description:
      "Various projects across Uber's map design team including map tooling, brand map prototyping, Map UI kit component development, and more.",
    href: "https://uber.design/",
    linkLabel: "Visit Uber Design →",
  },
  {
    image: "/img/nyc-marathon.png",
    imageAlt: "NYC Marathon map",
    tag: "Recreation · Mapbox GL",
    title: "NYC Marathon",
    description:
      "The NYC Marathon course, built with Mapbox GL and React. The map is used to display the course and the runners' progress. Broadcasted live on TV and online.",
    href: "https://www.youtube.com/live/fB5r6lHKyOc?si=KCI8j4LhcpoqSYbr&t=9445",
    linkLabel: "View broadcast →",
  },
  {
    image: "/img/mtc.png",
    imageAlt: "Vital Signs - MTC",
    tag: "Healthcare · Client",
    title: "Vital Signs - MTC",
    description:
      "A clinic locator and care-network explorer for a virtual-first primary-care provider — built to feel calm under load.",
    href: "https://vitalsigns.mtc.ca.gov/",
    linkLabel: "Visit Vital Signs →",
  },
];

export const archiveChips: ArchiveChip[] = [
  { label: "Simple Line Designer", image: "/img/analysis.png", href: "/portfolio/simple-line-designer" },
  { label: "Travel Times", image: "/img/earth-day.png", href: "/portfolio/fwc" },
  { label: "leftfut.com", image: "/img/matrix.png", href: "https://leftfut.com/" },
  { label: "Strava Routes", image: "/img/route-optimizer.png", href: "https://geografa.github.io/portfolio/" },
  // { label: "Global Stadiums", image: "/img/climb.gif", href: "https://geografa.github.io/portfolio/" },
  { label: "Visit Roosevelt Island", image: "/img/ri-nyc.png", href: "https://visitri.nyc/" },
  { label: "Orienteering", image: "/img/earth-day.png", href: "https://geografa.github.io/portfolio/" },
  { label: "Climate Solutions", image: "/img/vs-population.png", href: "https://geografa.github.io/portfolio/" },
  { label: "Model Swapper 3D", image: "/img/death-star.png", href: "https://geografa.github.io/portfolio/" },
];

export const approachSection = {
  label: "03 · How we work",
  title: "Customer-centered, from first call to handoff.",
  signature: "— Rafa",
  photo: {
    src: "/img/rafa-speaker.png",
    alt: "Rafa Gutierrez speaking at Oregon State University",
  },
};

export const testimonialsSection = {
  label: "04 · Kind words",
  title: "From the people we've worked alongside.",
  intro:
    "A few notes from former teammates at Mapbox — the kind of context that doesn't fit on a résumé.",
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "In a fast-paced environment, he shined as an empathetic leader. Always ready to pair with a teammate or experiment with a new process to improve the team's workflow, Rafa leads by example.",
    author: "Former Mapbox colleague",
    role: "Customer Solutions",
  },
  {
    quote:
      "Rafa and I worked side-by-side helping Mapbox customers understand the product and work through technical problems. He's one of the most empathetic, encouraging, and relentlessly helpful people I've ever worked with.",
    author: "Former Mapbox colleague",
    role: "Technical Support Engineering",
  },
  {
    quote:
      "Not a day passes that I'm not amazed by Rafa's institutional knowledge of the Mapbox universe. He's a walking encyclopedia of our products and the history behind them — why they were built, what was unique about them, which challenges they helped users solve.",
    author: "Former Mapbox colleague",
    role: "Product",
  },
];

export const aboutSection = {
  label: "05 · About",
  title: "Twenty years of paying attention to maps.",
  intro:
    "Portland · OR — Rafa Gutierrez has spent the last two decades in geospatial — first as a GIS manager in environmental consulting, then helping build out Mapbox's startup technical-support engineering team during the years it grew from a small group into a global product. Geografa is what he runs now: a focused dev shop for web map, with a roster of long-time collaborators on call when projects call for more hands.",
};

export const timeline: TimelineEntry[] = [
  { date: "2024 →", title: "Geografa", description: "Founder · web-mapping consultancy" },
  { date: "2018 — 2024", title: "Mapbox", description: "Built & led startup technical-support engineering" },
  { date: "2001 — 2018", title: "Environmental consulting", description: "GIS management · field-to-data workflows" },
  { date: "Always", title: "Maps in the open", description: "40+ experiments in the archive" },
];

export const contactSection = {
  label: "06 · Get in touch",
  titleBefore: "Let's ",
  titleEmphasis: "start mapping",
  titleAfter: ".",
  body:
    "Whether you're optimizing a stack you already have, scoping a new product, or just trying to figure out which basemap to use — drop a note. Most replies come within a day.",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/geografa", external: true },
    { label: "GitHub", href: "https://github.com/geografa", external: true },
  ],
};

export const footer = {
  tagline: "© 2026 · Portland, OR · more heart, less vibes",
};
