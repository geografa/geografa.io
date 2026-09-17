import { useEffect } from "react";
import type { Map } from "mapbox-gl";
import { withMap } from "@/lib/map";
import {
  EMISSIVE_FLICKER_MS,
  EMISSIVE_FLICKER_VALUES,
  KELVIN_CIRCLE_COLOR,
  LIGHTS_BLUR_LAYER_ID,
  LIGHTS_LAYER_ID,
  LIGHTS_SOURCE_ID,
  LIGHTS_SOURCE_LAYER,
  LIGHTS_TILESET_URL,
} from "./types";

export function useBoiseLights(map: Map | null, isLoaded: boolean) {
  useEffect(() => {
    if (!map || !isLoaded) return;

    let cancelled = false;
    let didSetup = false;
    let flickerIndex = 0;
    let flickerTimer: ReturnType<typeof setInterval> | null = null;

    const setup = () => {
      if (cancelled || didSetup || !map.isStyleLoaded()) return;
      didSetup = true;

      if (!map.getSource(LIGHTS_SOURCE_ID)) {
        map.addSource(LIGHTS_SOURCE_ID, {
          type: "vector",
          url: LIGHTS_TILESET_URL,
        });
      }

      if (!map.getLayer(LIGHTS_LAYER_ID)) {
        map.addLayer({
          id: LIGHTS_LAYER_ID,
          type: "circle",
          source: LIGHTS_SOURCE_ID,
          "source-layer": LIGHTS_SOURCE_LAYER,
          paint: {
            "circle-color": KELVIN_CIRCLE_COLOR,
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              9,
              0.15,
              13,
              1.5,
              16,
              3,
            ],
            "circle-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              0.15,
              10,
              0.5,
              14,
              1,
            ],
            "circle-emissive-strength": 1,
          },
        });
      }

      if (!map.getLayer(LIGHTS_BLUR_LAYER_ID)) {
        map.addLayer({
          id: LIGHTS_BLUR_LAYER_ID,
          type: "circle",
          source: LIGHTS_SOURCE_ID,
          "source-layer": LIGHTS_SOURCE_LAYER,
          paint: {
            "circle-color": KELVIN_CIRCLE_COLOR,
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              14,
              12,
              16,
              42,
            ],
            "circle-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              9,
              0,
              14,
              0.18,
              22,
              1,
            ],
            "circle-blur": [
              "interpolate",
              ["linear"],
              ["zoom"],
              9,
              0.5,
              16,
              2.5,
            ],
            "circle-emissive-strength": 1,
          },
        });
      }

      if (flickerTimer === null) {
        flickerTimer = setInterval(() => {
          if (cancelled || !map.getLayer(LIGHTS_BLUR_LAYER_ID)) return;
          map.setPaintProperty(
            LIGHTS_BLUR_LAYER_ID,
            "circle-emissive-strength",
            EMISSIVE_FLICKER_VALUES[flickerIndex],
          );
          flickerIndex = (flickerIndex + 1) % EMISSIVE_FLICKER_VALUES.length;
        }, EMISSIVE_FLICKER_MS);
      }
    };

    map.on("style.load", setup);
    map.on("idle", setup);
    setup();

    return () => {
      cancelled = true;
      map.off("style.load", setup);
      map.off("idle", setup);
      if (flickerTimer !== null) {
        clearInterval(flickerTimer);
        flickerTimer = null;
      }

      withMap(map, (liveMap) => {
        if (liveMap.getLayer(LIGHTS_BLUR_LAYER_ID)) {
          liveMap.removeLayer(LIGHTS_BLUR_LAYER_ID);
        }
        if (liveMap.getLayer(LIGHTS_LAYER_ID)) {
          liveMap.removeLayer(LIGHTS_LAYER_ID);
        }
        if (liveMap.getSource(LIGHTS_SOURCE_ID)) {
          liveMap.removeSource(LIGHTS_SOURCE_ID);
        }
      });
    };
  }, [map, isLoaded]);
}
