export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface Service {
  title: string;
  description: string;
}

export interface WorkItem {
  image: string;
  imageAlt: string;
  tag: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}

export interface CaseStudyImage {
  src: string;
  alt: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  tag: string;
  client: string;
  year: string;
  heroImage: string;
  heroImageAlt: string;
  summary: string;
  body: string[];
  scope: string[];
  gallery: CaseStudyImage[];
  videoEmbedUrl?: string;
  videoTitle?: string;
  externalHref?: string;
  externalLabel?: string;
}

export interface ArchiveChip {
  label: string;
  image: string;
  href: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description?: string;
}

export type SectionVariant = "cream" | "ink" | "green";
