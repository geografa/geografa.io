import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface MapDemoShellProps {
  title: string;
  backHref?: string;
  backLabel?: string;
  map: ReactNode;
  sidebar?: ReactNode;
}

export function MapDemoShell({
  title,
  backHref = "/",
  backLabel = "← Geografa",
  map,
  sidebar,
}: MapDemoShellProps) {
  return (
    <div className="map-demo-shell">
      <header className="map-demo-shell__header">
        <Link
          replace
          to={{ pathname: backHref, hash: "" }}
          className="map-demo-shell__back"
        >
          {backLabel}
        </Link>
        <h1 className="map-demo-shell__title">{title}</h1>
      </header>
      <div className="map-demo-shell__map">{map}</div>
      {sidebar}
    </div>
  );
}
