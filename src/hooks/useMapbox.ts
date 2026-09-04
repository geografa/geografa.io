import { useEffect, useRef, useState } from "react";
import mapboxgl, { type Map, type MapOptions } from "mapbox-gl";
import { getMapboxToken } from "@/config/env";
import { applyStandardLightPreset } from "@/lib/map/defaults";
import { markMapDetached } from "@/lib/map/safety";

export interface UseMapboxOptions extends Omit<MapOptions, "container"> {
  lightPreset?: "day" | "night";
}

export interface UseMapboxResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  map: Map | null;
  isLoaded: boolean;
  error: Error | null;
}

export function useMapbox(options: UseMapboxOptions = {}): UseMapboxResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { lightPreset = "day", ...mapOptions } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let mapInstance: Map;

    try {
      mapboxgl.accessToken = getMapboxToken();
      mapInstance = new mapboxgl.Map({ container, ...mapOptions });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return;
    }

    mapRef.current = mapInstance;
    setMap(mapInstance);

    const onLoad = () => {
      if (cancelled) return;
      applyStandardLightPreset(mapInstance, lightPreset);
      setIsLoaded(true);
    };

    const onStyleLoad = () => {
      if (cancelled) return;
      applyStandardLightPreset(mapInstance, lightPreset);
    };

    mapInstance.on("load", onLoad);
    mapInstance.on("style.load", onStyleLoad);

    return () => {
      cancelled = true;
      mapRef.current = null;
      markMapDetached(mapInstance);

      // Sibling/child cleanups still hold this instance and run after this one,
      // so destroy it once the current commit has finished.
      queueMicrotask(() => {
        try {
          mapInstance.off("load", onLoad);
          mapInstance.off("style.load", onStyleLoad);
          mapInstance.remove();
        } catch {
          // already destroyed
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map init once per mount
  }, []);

  return {
    containerRef,
    map: mapRef.current ?? map,
    isLoaded,
    error,
  };
}
