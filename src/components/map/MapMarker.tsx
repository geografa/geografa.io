import { useEffect } from "react";
import type { ReactNode } from "react";
import mapboxgl, { type LngLatLike, type Map } from "mapbox-gl";
import { mapColors } from "@/theme";

interface MapMarkerProps {
  map: Map;
  lngLat: LngLatLike;
  color?: string;
  children?: ReactNode;
}

export function MapMarker({
  map,
  lngLat,
  color = mapColors.accent,
  children,
}: MapMarkerProps) {
  useEffect(() => {
    const element = children
      ? (() => {
          const el = document.createElement("div");
          return el;
        })()
      : undefined;

    const marker = new mapboxgl.Marker(
      element ? { element, color } : { color },
    )
      .setLngLat(lngLat)
      .addTo(map);

    return () => {
      marker.remove();
    };
  }, [map, lngLat, color, children]);

  return null;
}
