import type {
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
  { label: "Portfolio", href: "#selected" },
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
};

export const featuredWork: WorkItem[] = [
  {
    image: "/img/uber.png",
    imageAlt: "Uber Design",
    tag: "Navigation · Client",
    title: "Uber Map Design",
    description:
      "Various projects across Uber's map design team including map tooling, brand map prototyping, Map UI kit component development, and more.",
    href: "https://uber.design/",
    linkLabel: "Visit Uber Design →",
  },
  {
    image: "/img/nyc-marathon.png",
    imageAlt: "NYC Marathon map",
    tag: "Recreation · Client",
    title: "NYC Marathon",
    description:
      "The NYC Marathon course, built with Mapbox GL and React. The map is used to display the course and the runners' progress. Broadcasted live on TV and online.",
    href: "https://www.youtube.com/live/fB5r6lHKyOc?si=KCI8j4LhcpoqSYbr&t=9445",
    linkLabel: "View broadcast →",
  },
  {
    image: "/img/mtc.png",
    imageAlt: "Vital Signs - MTC",
    tag: "Transportation · Client",
    title: "Vital Signs - MTC",
    description:
      "Vital Signs is an interactive website by the Metropolitan Transportation Commission (MTC) and Association of Bay Area Governments (ABAG) that offers data, visualizations, and contextualized narratives on important trends in the San Francisco Bay Area related to land use, transportation, the environment, the economy and equity.",
    href: "https://vitalsigns.mtc.ca.gov/",
    linkLabel: "Visit Vital Signs →",
  },
  {
    image: "/img/ri-nyc.png",
    imageAlt: "Visit Roosevelt Island",
    tag: "Recreation · Client",
    title: "Visit Roosevelt Island",
    description:
      "Explore what Roosevelt Island has to offer, from local events to businesses and community resources, all in one place.",
    href: "https://visitri.nyc/",
    linkLabel: "Visit site →",
  },
  {
    image: "/img/card-firefly.png",
    imageAlt: "Firefly Health",
    tag: "Healthcare · Client",
    title: "Firefly Health",
    description:
      "We're continually adding new partner locations to offer our members more convenient and accessible options for in-person care.",
    href: "https://www.fireflyhealth.com/firefly-nearby/",
    linkLabel: "Visit Firefly Nearby →",
  },
  {
    image: "/img/card-sld.png",
    imageAlt: "Line Designer",
    tag: "Cartography · Utility",
    title: "Line Designer",
    description:
      "A utility for styling line features using Mapbox GL JS and the style spec.",
    href: "/portfolio/simple-line-designer",
    linkLabel: "Open tool →",
  },
  {
    image: "/img/model-mapper.png",
    imageAlt: "Model Mapper",
    tag: "Cartography · Utility",
    title: "Model Mapper",
    description:
      "A utility for testing 3D models using Mapbox GL JS.",
    href: "/portfolio/model-mapper",
    linkLabel: "Open tool →",
  },
  {
    image: "/img/pdxtraffic.png",
    imageAlt: "PDX Traffic live cams map",
    tag: "Cartography · Demo",
    title: "PDX Traffic",
    description:
      "Live Portland area traffic and ODOT cameras. Utilizing Mapbox Matrix API for real-time ETAs.",
    href: "https://pdxtraffic.com",
    linkLabel: "Visit PDX Traffic →",
  },
  {
    image: "/img/earth-day.png",
    imageAlt: "Travel Times",
    tag: "Cartography · Demo",
    title: "Travel Times",
    description:
      "Estimated travel times between host cities, hotels, and stadiums for the FIFA World Cup 2026.",
    href: "/portfolio/fwc",
    linkLabel: "Open demo →",
  },
  {
    image: "/img/card-leftfut.png",
    imageAlt: "Leftfut",
    tag: "Cartography · Demo",
    title: "Leftfut",
    description:
      "Stadiums of the world by capacity.",
    href: "https://leftfut.com/",
    linkLabel: "Visit Leftfut →",
  },
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
  title: "Over twenty years of geospatial engineering.",
  intro:
    "With 20 years of geospatial engineering experience, Portland-based Rafa Gutierrez runs Geografa, a dedicated web-mapping dev shop. His background includes serving as a GIS manager in environmental consulting and helping scale Mapbox's technical support team from local startup to global product. For larger builds, Geografa leverages a reliable network of experienced on-call collaborators.",
};

export const timeline: TimelineEntry[] = [
  {
    year: "2026",
    title: "Uber",
    description: "Map Design Team · Tooling and Prototyping",
  },
  {
    year: "2024",
    title: "Metropolitan Transportation Commission",
    description: "Vital Signs · map refactor and redesign",
  },
  {
    year: "2013",
    title: "Mapbox",
    description: "Lead Technical Support Engineer & Navigation API SME",
  },
  {
    year: "2002",
    title: "SWCA Environmental",
    description: "GIS Manager",
  },
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
