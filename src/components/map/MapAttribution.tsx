import { useLayoutEffect } from "react";
import mapboxgl, { type Map } from "mapbox-gl";

interface MapAttributionProps {
  map: Map;
  showNavigation?: boolean;
}

export function MapAttribution({
  map,
  showNavigation = true,
}: MapAttributionProps) {
  useLayoutEffect(() => {
    const nav = showNavigation
      ? new mapboxgl.NavigationControl({ visualizePitch: true })
      : null;
    const attribution = new mapboxgl.AttributionControl({ compact: true });

    if (nav) {
      map.addControl(nav, "top-right");
    }
    map.addControl(attribution, "bottom-right");

    return () => {
      if (nav) {
        try {
          map.removeControl(nav);
        } catch {
          // map may already be removed
        }
      }
      try {
        map.removeControl(attribution);
      } catch {
        // map may already be removed
      }
    };
  }, [map, showNavigation]);

  return null;
}
