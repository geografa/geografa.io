import { useEffect } from "react";
import mapboxgl, { type Map } from "mapbox-gl";
import { withMap } from "@/lib/map";

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
      withMap(map, (liveMap) => {
        if (nav) {
          liveMap.removeControl(nav);
        }
        liveMap.removeControl(attribution);
      });
    };
  }, [map, showNavigation]);

  return null;
}
