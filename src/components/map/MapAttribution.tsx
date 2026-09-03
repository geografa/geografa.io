import { useEffect } from "react";
import mapboxgl, { type Map } from "mapbox-gl";

interface MapAttributionProps {
  map: Map;
  showNavigation?: boolean;
}

export function MapAttribution({
  map,
  showNavigation = true,
}: MapAttributionProps) {
  useEffect(() => {
    const nav = showNavigation
      ? new mapboxgl.NavigationControl({ visualizePitch: true })
      : null;
    const attribution = new mapboxgl.AttributionControl({ compact: true });

    if (nav) {
      map.addControl(nav, "top-right");
    }
    map.addControl(attribution, "bottom-right");

    return () => {
      if (nav) map.removeControl(nav);
      map.removeControl(attribution);
    };
  }, [map, showNavigation]);

  return null;
}
