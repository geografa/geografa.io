import type { ReactNode } from "react";
import type { SectionVariant } from "@/types/content";
import { SectionLabel } from "./SectionLabel";

const variantClass: Record<SectionVariant, string> = {
  cream: "",
  ink: "ink-bg",
  green: "transit-bg",
};

interface SectionProps {
  id?: string;
  variant?: SectionVariant;
  label: string;
  children: ReactNode;
  className?: string;
}

export function Section({
  id,
  variant = "cream",
  label,
  children,
  className = "",
}: SectionProps) {
  const wrapperClass = variantClass[variant];
  const labelDark = variant === "cream";

  const inner = (
    <div className={`section ${className}`.trim()}>
      <SectionLabel dark={labelDark}>{label}</SectionLabel>
      {children}
    </div>
  );

  if (wrapperClass) {
    return (
      <div className={wrapperClass} id={id}>
        {inner}
      </div>
    );
  }

  return <div id={id}>{inner}</div>;
}
