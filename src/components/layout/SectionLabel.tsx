import type { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  dark?: boolean;
}

export function SectionLabel({ children, dark = false }: SectionLabelProps) {
  const className = dark
    ? "section-label section-label--dark"
    : "section-label";
  return <div className={className}>{children}</div>;
}
