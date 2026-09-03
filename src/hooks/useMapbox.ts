import { useEffect, useRef, useState } from "react";
import mapboxgl, { type Map, type MapOptions } from "mapbox-gl";
import { getMapboxToken } from "@/config/env";
import { applyStandardLightPreset } from "@/lib/map/defaults";

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
  const [map, setMap] = useState<Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { lightPreset = "day", ...mapOptions } = options;

  useEffect(() => {
    if (!containerRef.current) return;

    let mapInstance: Map | null = null;

    try {
      mapboxgl.accessToken = getMapboxToken();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return;
    }

    mapInstance = new mapboxgl.Map({
      container: containerRef.current,
      ...mapOptions,
    });

    setMap(mapInstance);

    const onLoad = () => {
      if (!mapInstance) return;
      applyStandardLightPreset(mapInstance, lightPreset);
      setIsLoaded(true);
    };

    const onStyleLoad = () => {
      if (!mapInstance) return;
      applyStandardLightPreset(mapInstance, lightPreset);
    };

    mapInstance.on("load", onLoad);
    mapInstance.on("style.load", onStyleLoad);

    return () => {
      if (!mapInstance) return;
      mapInstance.off("load", onLoad);
      mapInstance.off("style.load", onStyleLoad);
      mapInstance.remove();
      setMap(null);
      setIsLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map init once per mount
  }, []);

  return {
    containerRef,
    map,
    isLoaded,
    error,
  };
}
