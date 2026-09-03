import type { ReactNode } from "react";
import { MapCopyButton } from "./MapCopyButton";

interface MapSidebarProps {
  title: string;
  position?: "left" | "right";
  onCopy?: () => Record<string, unknown> | void;
  children: ReactNode;
}

export function MapSidebar({
  title,
  position = "left",
  onCopy,
  children,
}: MapSidebarProps) {
  return (
    <aside className={`map-sidebar map-sidebar--${position}`}>
      <div className="map-sidebar__header">
        <h2 className="map-sidebar__title">{title}</h2>
        {onCopy ? <MapCopyButton getValue={onCopy} /> : null}
      </div>
      {children}
    </aside>
  );
}

export function MapSidebarSection({ title }: { title: string }) {
  return <h3 className="map-sidebar__section">{title}</h3>;
}
