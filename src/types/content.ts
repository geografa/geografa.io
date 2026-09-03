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
  date: string;
  title: string;
  description: string;
}

export type SectionVariant = "cream" | "ink" | "green";
