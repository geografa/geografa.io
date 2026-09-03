import type { ReactNode } from "react";
import type { Map } from "mapbox-gl";
import { useMapbox, type UseMapboxOptions } from "@/hooks/useMapbox";

interface MapCanvasProps extends UseMapboxOptions {
  className?: string;
  children?: (ctx: { map: Map; isLoaded: boolean }) => ReactNode;
}

export function MapCanvas({
  className = "",
  children,
  ...options
}: MapCanvasProps) {
  const { containerRef, map, isLoaded, error } = useMapbox(options);

  if (error) {
    return (
      <div className={`map-canvas map-canvas__error ${className}`.trim()}>
        {error.message}
      </div>
    );
  }

  return (
    <div className={`map-canvas-wrap ${className}`.trim()}>
      <div ref={containerRef} className="map-canvas" />
      {map && children?.({ map, isLoaded })}
    </div>
  );
}
