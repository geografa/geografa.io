import { Link } from "react-router-dom";
import type { ArchiveChip } from "@/types/content";

function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function WorkChip({ item }: { item: ArchiveChip }) {
  const className = "work-chip";

  if (isInternalHref(item.href)) {
    return (
      <Link to={item.href} replace className={className}>
        <img src={item.image} alt="" />
        {item.label}
      </Link>
    );
  }

  return (
    <a
      href={item.href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={item.image} alt="" />
      {item.label}
    </a>
  );
}
