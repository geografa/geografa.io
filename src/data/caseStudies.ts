import type { CaseStudy } from "@/types/content";

export const caseStudies: CaseStudy[] = [
  {
    slug: "uber",
    title: "Uber Map Design Engineering",
    tag: "Navigation · Client",
    client: "Uber",
    year: "2026",
    heroImage: "/img/uber/uber.png",
    heroImageAlt: "Uber map design work",
    summary:
      "Design engineering for Uber's Map Design team including basemap styling, map UI systems, and prototyping tools.",
    body: [
      "Contracting with Uber, Geografa worked with the Map Design team to design and build map-facing product work spanning cartographic tooling, brand prototyping, and reusable UI components for navigation experiences.",
    ],
    scope: [
      "Refactored the map style compiler to support a basemap redesign, restructuring it around product needs with flexible style variants such as light and dark. The compiler was built in code and output Uber compliant style JSON.",
      "Added several UI enhancements to the map style compiler, including support for custom UI components, product screens for pressure-testing, and feature query capabilities.",
      "Built internal cartography and map UI tooling to speed up prototype development such as the Model Mapper, a tool for placing models on map styles.",
      "Prototyped map experiences that enhanced the rider's experience en route using Mapbox GL JS, Blender, and Spline. Prototypes included 3D models of landmarks, animated vehicles, and overlay effects.",
      "Designed and built a Maps UI Kit of React web components, packaged as an AI plugin, that gave design teams direct access to the source of truth for map features, including standard pointer markers, POIs, labels, colors, and route lines.",
      "Designed Google map style matching Uber's production basemap for geographies required to use Google Maps.",
    ],
    gallery: [
      { src: "/img/uber/uber.png", alt: "Uber map design placeholder" },
    ],
    externalHref: "https://uber.design/",
    externalLabel: "Visit Uber Design →",
  },
  {
    slug: "nyc-marathon",
    title: "TCS New York City Marathon 2025",
    tag: "Recreation · Client",
    client: "Tata Consultancy Services",
    year: "2025",
    heroImage: "/img/nyc/nyc-cover.png",
    heroImageAlt: "NYC Marathon course map with 3D landmarks",
    summary:
      "Geografa partnered with Tata Consultancy Services (TCS) to design the map used for live runner tracking during the 2025 TCS New York City Marathon broadcast.",
    body: [
      "TCS handled the tracking data and broadcast integration, while Geografa owned the map itself, from basemap design through 3D features and camera orchestration.",
      "Built with Mapbox Studio and Mapbox GL JS, the map combined course routes and mile markers, street-tree data from NYC Parks, and custom 3D models of landmarks along the route. Because camera moves were controlled remotely during the live broadcast, Geografa also helped develop the GL JS orchestration methods that drove the map's animations on air.",
      "The broadcast reached viewers in more than 160 countries through international partners, and the project helped TCS win the contract for the Boston Marathon.",
    ],
    scope: [
      "Designed a custom basemap to the NYC Marathon's brand and design specifications",
      "Processed and imported NYC Parks tree data into the map",
      "Built and integrated 3D models for key course features, including the start and finish areas, trees, and bridges",
      "Helped develop camera orchestration methods in Mapbox GL JS for remotely controlled animations during the live broadcast",
    ],
    gallery: [
      {
        src: "/img/nyc/nyc-marathon.png",
        alt: "NYC Marathon map overview",
      },
      {
        src: "/img/nyc/finish.png",
        alt: "Finish area 3D map view",
      },
      {
        src: "/img/nyc/finish-3D.png",
        alt: "Marathon map scene 17",
      },
      {
        src: "/img/nyc/nyc-11.png",
        alt: "Course map detail with landmarks",
      },
      {
        src: "/img/nyc/untitled-16.png",
        alt: "Marathon map scene 16",
      },
    ],
    videoEmbedUrl:
      "https://www.youtube.com/embed/fB5r6lHKyOc?si=ohRSZ57G9oA9iCk0&start=9449",
    videoTitle: "TCS New York City Marathon 2025 broadcast",
    externalHref:
      "https://www.youtube.com/live/fB5r6lHKyOc?si=KCI8j4LhcpoqSYbr&t=9445",
    externalLabel: "View broadcast →",
  },
  {
    slug: "vital-signs",
    title: "Vital Signs - MTC",
    tag: "Transportation · Client",
    client: "Metropolitan Transportation Commission",
    year: "2024",
    heroImage: "/img/vital-signs/cover.png",
    heroImageAlt: "Vital Signs MTC interactive map",
    summary:
      "Under contract with Peak Digital, Geografa redesigned thematic maps for Metropolitan Transportation Commission's Vital Signs platform, a consumer-facing regional data dashboard serving Bay Area residents with land use, transportation, environmental, and equity indicators.",
    body: [
      "The project entailed architecting interactive map components using Mapbox GL JS, React, and TypeScript, translating complex census data, transportation networks, and demographic information into clear, human-centered visualizations. Several components required built dynamic map styling systems with Mapbox expressions for real-time filtering, data-driven styling, and responsive cartographic hierarchies that adapt to user interaction patterns.",
      "Additionally, geospatial data pipelines (QGIS, GDAL, Mapbox Tiling Service) were created to transform raw spatial data into optimized vector tilesets for high-performance web rendering.",
    ],
    scope: [
      "Redesigned thematic maps for Vital Signs' land use, transportation, environmental, and equity indicators",
      "Architected interactive Mapbox GL JS, React, and TypeScript map components for census, transportation, and demographic data",
      "Built dynamic Mapbox expression styling for real-time filtering, data-driven cartography, and responsive hierarchies",
      "Created geospatial data pipelines with QGIS, GDAL, and Mapbox Tiling Service for optimized vector tilesets",
    ],
    gallery: [
      { src: "/img/vital-signs/bridges.png", alt: "Vital Signs MTC Bridges" },
      { src: "/img/vital-signs/vs-popdensity.png", alt: "Vital Signs MTC Population Density" },
      { src: "/img/vital-signs/vs-commute.png", alt: "Vital Signs MTC Commute Mode" },
      { src: "/img/vital-signs/vs-jobs.png", alt: "Vital Signs MTC Jobs" },
      { src: "/img/vital-signs/jobs.gif", alt: "Vital Signs MTC Jobs" },
      { src: "/img/vital-signs/convert-mapbox.png", alt: "Vital Signs MTC Convert Mapbox" },
    ],
    externalHref: "https://vitalsigns.mtc.ca.gov/",
    externalLabel: "Visit Vital Signs →",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
