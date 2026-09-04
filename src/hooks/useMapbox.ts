import { useLayoutEffect, useRef, useState } from "react";
import mapboxgl, { type Map, type MapOptions } from "mapbox-gl";
import { getMapboxToken } from "@/config/env";
import { applyStandardLightPreset } from "@/lib/map/defaults";
import { resetPageAfterMap } from "@/lib/map/resetPageAfterMap";

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

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mapInstance: Map | null = null;
    let cancelled = false;

    try {
      mapboxgl.accessToken = getMapboxToken();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return;
    }

    mapInstance = new mapboxgl.Map({
      container,
      ...mapOptions,
    });

    mapRef.current = mapInstance;
    setMap(mapInstance);

    const onLoad = () => {
      if (cancelled || !mapInstance) return;
      applyStandardLightPreset(mapInstance, lightPreset);
      setIsLoaded(true);
    };

    const onStyleLoad = () => {
      if (cancelled || !mapInstance) return;
      applyStandardLightPreset(mapInstance, lightPreset);
    };

    mapInstance.on("load", onLoad);
    mapInstance.on("style.load", onStyleLoad);

    return () => {
      cancelled = true;
      if (!mapInstance) return;
      mapInstance.off("load", onLoad);
      mapInstance.off("style.load", onStyleLoad);
      mapInstance.remove();
      mapRef.current = null;
      resetPageAfterMap();
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
