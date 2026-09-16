import { useEffect, useRef } from "react";
import type { Map, MapLayerMouseEvent } from "mapbox-gl";
import { randomPoint } from "@turf/turf";
import { withMap } from "@/lib/map";
import {
  GHOST_COUNT,
  GHOST_LAYER_ID,
  GHOST_MODEL_ID,
  GHOST_MODEL_URI,
  GHOST_SOURCE_ID,
  GHOSTS_BBOX,
} from "./types";

type GhostProperties = {
  phase: number;
  speed: number;
  amp: number;
};

type GhostFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  GhostProperties
>;

function buildGhostPoints(): GhostFeatureCollection {
  const points = randomPoint(GHOST_COUNT, { bbox: GHOSTS_BBOX });

  points.features.forEach((feature, index) => {
    feature.id = index;
    feature.properties = {
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.2,
      amp: 4 + Math.random() * 6,
    };
  });

  return points as GhostFeatureCollection;
}

function toAbsoluteUrl(uri: string): string {
  if (
    uri.startsWith("blob:") ||
    uri.startsWith("http://") ||
    uri.startsWith("https://") ||
    uri.startsWith("mapbox://")
  ) {
    return uri;
  }
  return new URL(uri, window.location.origin).href;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useGhosts(map: Map | null, isLoaded: boolean) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!map || !isLoaded) return;

    let cancelled = false;
    let didSetup = false;
    const points = buildGhostPoints();
    const modelUrl = toAbsoluteUrl(GHOST_MODEL_URI);

    const startAnimation = () => {
      if (rafRef.current !== null) return;
      const start = performance.now();
      const animate = () => {
        if (cancelled) return;
        const t = (performance.now() - start) / 1000;

        points.features.forEach((feature, index) => {
          const amp = feature.properties?.amp ?? 5;
          const speed = feature.properties?.speed ?? 1;
          const phase = feature.properties?.phase ?? 0;
          const z = amp * Math.sin(speed * t + phase);
          map.setFeatureState({ source: GHOST_SOURCE_ID, id: index }, { z });
        });

        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    };

    const setup = () => {
      if (cancelled || didSetup || !map.isStyleLoaded()) return;
      didSetup = true;

      try {
        map.setConfigProperty("basemap", "lightPreset", "night");
      } catch {
        // style may not expose basemap config
      }

      if (!map.getSource(GHOST_SOURCE_ID)) {
        map.addSource(GHOST_SOURCE_ID, {
          type: "geojson",
          data: points,
        });
      }

      try {
        if (map.hasModel(GHOST_MODEL_ID)) {
          map.removeModel(GHOST_MODEL_ID);
        }
      } catch {
        // ignore
      }
      map.addModel(GHOST_MODEL_ID, modelUrl);

      if (!map.getLayer(GHOST_LAYER_ID)) {
        map.addLayer({
          id: GHOST_LAYER_ID,
          type: "model",
          source: GHOST_SOURCE_ID,
          layout: { "model-id": GHOST_MODEL_ID },
          paint: {
            "model-scale": [10, 10, 10],
            "model-rotation": [
              0,
              0,
              ["*", 10, ["coalesce", ["feature-state", "z"], 0]],
            ],
            "model-emissive-strength": 1,
            "model-translation": [
              0,
              0,
              [
                "+",
                10,
                ["coalesce", ["feature-state", "z"], 0],
                ["coalesce", ["feature-state", "elevationOffset"], 0],
              ],
            ],
          },
        });
      }

      startAnimation();
    };

    // `load` can fire before `isStyleLoaded()` is true for custom styles.
    // Retry on style.load + idle so setup is not missed.
    map.on("style.load", setup);
    map.on("idle", setup);
    setup();

    const onClick = (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (feature?.id === undefined) return;

      const featureId = feature.id as number;
      const currentState = map.getFeatureState({
        source: GHOST_SOURCE_ID,
        id: featureId,
      }) as { elevated?: boolean; elevationOffset?: number };

      const isElevated = Boolean(currentState.elevated);
      const targetElevation = isElevated ? 0 : 200;
      const startElevation = currentState.elevationOffset ?? 0;
      const duration = 1000;
      const startTime = performance.now();

      const animateElevation = () => {
        if (cancelled) return;
        const progress = Math.min((performance.now() - startTime) / duration, 1);
        const eased = easeOutCubic(progress);
        const currentElevation =
          startElevation + (targetElevation - startElevation) * eased;

        map.setFeatureState(
          { source: GHOST_SOURCE_ID, id: featureId },
          {
            elevated: !isElevated,
            elevationOffset: currentElevation,
          },
        );

        if (progress < 1) {
          requestAnimationFrame(animateElevation);
        }
      };

      requestAnimationFrame(animateElevation);
    };

    map.on("click", GHOST_LAYER_ID, onClick);

    return () => {
      cancelled = true;
      map.off("style.load", setup);
      map.off("idle", setup);
      map.off("click", GHOST_LAYER_ID, onClick);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      withMap(map, (liveMap) => {
        if (liveMap.getLayer(GHOST_LAYER_ID)) {
          liveMap.removeLayer(GHOST_LAYER_ID);
        }
        if (liveMap.getSource(GHOST_SOURCE_ID)) {
          liveMap.removeSource(GHOST_SOURCE_ID);
        }
        if (liveMap.hasModel?.(GHOST_MODEL_ID)) {
          try {
            liveMap.removeModel(GHOST_MODEL_ID);
          } catch {
            // ignore
          }
        }
      });
    };
  }, [map, isLoaded]);
}
