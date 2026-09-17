import { useEffect, useRef } from "react";
import type { Map } from "mapbox-gl";
import { withMap } from "@/lib/map";
import {
  CONIFER_MODEL_ID,
  CONIFER_MODEL_URI,
  DECIDUOUS_MODEL_ID,
  DECIDUOUS_MODEL_URI,
  TREE_LAYER_ID,
  TREE_SOURCE_ID,
  TREE_SOURCE_LAYER,
  TREE_TILESET_URL,
  TREES_INTRO_CAMERA,
} from "./types";

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

function ensureModel(map: Map, modelId: string, uri: string): void {
  try {
    if (map.hasModel(modelId)) {
      map.removeModel(modelId);
    }
  } catch {
    // ignore
  }
  map.addModel(modelId, toAbsoluteUrl(uri));
}

export function usePortlandTrees(map: Map | null, isLoaded: boolean) {
  const didIntroRef = useRef(false);

  useEffect(() => {
    if (!map || !isLoaded) return;

    let cancelled = false;
    let didSetup = false;

    const setup = () => {
      if (cancelled || didSetup || !map.isStyleLoaded()) return;
      didSetup = true;

      if (!map.getSource(TREE_SOURCE_ID)) {
        map.addSource(TREE_SOURCE_ID, {
          type: "vector",
          url: TREE_TILESET_URL,
        });
      }

      ensureModel(map, CONIFER_MODEL_ID, CONIFER_MODEL_URI);
      ensureModel(map, DECIDUOUS_MODEL_ID, DECIDUOUS_MODEL_URI);

      if (!map.getLayer(TREE_LAYER_ID)) {
        map.addLayer({
          id: TREE_LAYER_ID,
          type: "model",
          slot: "middle",
          source: TREE_SOURCE_ID,
          "source-layer": TREE_SOURCE_LAYER,
          layout: {
            "model-id": [
              "match",
              ["get", "FunctionalType"],
              "BD",
              DECIDUOUS_MODEL_ID,
              "CE",
              CONIFER_MODEL_ID,
              "BE",
              CONIFER_MODEL_ID,
              "CD",
              CONIFER_MODEL_ID,
              DECIDUOUS_MODEL_ID,
            ],
          },
          paint: {
            "model-scale": [
              "match",
              ["get", "Size"],
              "S",
              [1, 1, 1],
              "M",
              [2, 2, 2],
              "L",
              [3, 3, 3],
              [1, 1, 1],
            ],
            "model-cast-shadows": true,
          },
        });
      }

      if (!didIntroRef.current) {
        didIntroRef.current = true;
        map.easeTo({
          ...TREES_INTRO_CAMERA,
          speed: 0.2,
          curve: 1.5,
          easing: (t) => t,
        });
      }
    };

    map.on("style.load", setup);
    map.on("idle", setup);
    setup();

    return () => {
      cancelled = true;
      map.off("style.load", setup);
      map.off("idle", setup);

      withMap(map, (liveMap) => {
        if (liveMap.getLayer(TREE_LAYER_ID)) {
          liveMap.removeLayer(TREE_LAYER_ID);
        }
        if (liveMap.getSource(TREE_SOURCE_ID)) {
          liveMap.removeSource(TREE_SOURCE_ID);
        }
        for (const modelId of [CONIFER_MODEL_ID, DECIDUOUS_MODEL_ID]) {
          if (liveMap.hasModel?.(modelId)) {
            try {
              liveMap.removeModel(modelId);
            } catch {
              // ignore
            }
          }
        }
      });
    };
  }, [map, isLoaded]);
}
