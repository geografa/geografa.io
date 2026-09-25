import { useEffect } from "react";
import type { Map } from "mapbox-gl";
import {
  WINTER_WONDERLAND_TOUR,
  WINTER_WONDERLAND_TOUR_DURATION_MS,
} from "./types";

export function useWinterWonderlandTour(map: Map | null, isLoaded: boolean) {
  useEffect(() => {
    if (!map || !isLoaded) return;

    let cancelled = false;
    let started = false;
    let index = 0;

    const flyNext = () => {
      if (cancelled) return;

      const stop =
        WINTER_WONDERLAND_TOUR[index % WINTER_WONDERLAND_TOUR.length];
      index += 1;

      map.flyTo({
        center: stop.center,
        zoom: stop.zoom,
        bearing: stop.bearing,
        pitch: stop.pitch,
        duration: WINTER_WONDERLAND_TOUR_DURATION_MS,
        essential: true,
        easing: (t) => t,
      });

      map.once("moveend", flyNext);
    };

    const start = () => {
      if (cancelled || started || !map.isStyleLoaded()) return;
      started = true;
      flyNext();
    };

    map.on("idle", start);
    start();

    return () => {
      cancelled = true;
      map.off("idle", start);
      map.stop();
    };
  }, [map, isLoaded]);
}
