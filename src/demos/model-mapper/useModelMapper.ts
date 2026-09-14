import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl, { type GeoJSONSource, type Map, type MapMouseEvent } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { getMapboxToken } from "@/config/env";
import { applyStandardLightPreset, withMap } from "@/lib/map";
import {
  DEFAULT_MODEL_LABEL,
  DEFAULT_MODEL_URI,
  ERASER_CLIP_LAYER_ID,
  ERASER_LINE_LAYER_ID,
  ERASER_SOURCE_ID,
  INITIAL_MODEL_COORDINATES,
  MODEL_LAYER_ID,
  MODEL_SOURCE_ID,
  formatCoords,
  initialModelMapperState,
  isGlbFile,
  paintPropsFromState,
  type ModelMapperState,
} from "./types";

const emptyEraseArea: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

const DEFAULT_MODEL_ID = "model-mapper-default";
const UPLOAD_MODEL_ID = "model-mapper-upload";

function toAbsoluteModelUrl(uri: string): string {
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

function applyPaintFromState(map: Map, state: ModelMapperState): void {
  if (!map.getLayer(MODEL_LAYER_ID)) return;
  map.setPaintProperty(MODEL_LAYER_ID, "model-rotation", [
    0,
    0,
    state.rotation,
  ]);
  map.setPaintProperty(MODEL_LAYER_ID, "model-scale", [
    state.scale,
    state.scale,
    state.scale,
  ]);
  map.setPaintProperty(
    MODEL_LAYER_ID,
    "model-color-mix-intensity",
    state.colorMixIntensity,
  );
  map.setPaintProperty(MODEL_LAYER_ID, "model-opacity", state.opacity);
  map.setPaintProperty(MODEL_LAYER_ID, "model-color", state.color);
}

function ensureModelRegistered(map: Map, modelId: string, uri: string): void {
  const absolute = toAbsoluteModelUrl(uri);
  if (map.hasModel(modelId)) {
    try {
      map.removeModel(modelId);
    } catch {
      // ignore
    }
  }
  map.addModel(modelId, absolute);
}

function setModelFeature(
  map: Map,
  modelId: string,
  modelUri: string,
  coordinates: [number, number],
  paint?: ModelMapperState,
): void {
  ensureModelRegistered(map, modelId, modelUri);

  const data: GeoJSON.Feature = {
    type: "Feature",
    properties: { "model-uri": modelId },
    geometry: { type: "Point", coordinates },
  };

  const source = map.getSource(MODEL_SOURCE_ID) as GeoJSONSource | undefined;
  if (source) {
    source.setData(data);
  } else {
    map.addSource(MODEL_SOURCE_ID, { type: "geojson", data });
  }

  if (!map.getLayer(MODEL_LAYER_ID)) {
    map.addLayer({
      id: MODEL_LAYER_ID,
      type: "model",
      slot: "middle",
      source: MODEL_SOURCE_ID,
      minzoom: 14,
      layout: {
        "model-id": ["get", "model-uri"],
      },
      paint: {
        "model-color-mix-intensity": 0,
        "model-color": "rgba(0,0,0,1)",
        "model-scale": [1, 1, 1],
        "model-rotation": [0, 0, 0],
        "model-opacity": 1,
        "model-cast-shadows": true,
        "model-emissive-strength": 1,
      },
    });
  }

  if (paint) {
    applyPaintFromState(map, paint);
  }
}

function placeDefaultModel(map: Map, paint: ModelMapperState): void {
  setModelFeature(
    map,
    DEFAULT_MODEL_ID,
    DEFAULT_MODEL_URI,
    INITIAL_MODEL_COORDINATES,
    paint,
  );
}

export function useModelMapper(map: Map | null, isLoaded: boolean) {
  const [state, setState] = useState<ModelMapperState>(initialModelMapperState);
  const stateRef = useRef(state);
  stateRef.current = state;
  const objectUrlRef = useRef<string | null>(null);
  const activeModelIdRef = useRef(DEFAULT_MODEL_ID);

  const update = useCallback((patch: Partial<ModelMapperState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const dismissIntro = useCallback(() => {
    update({ showIntro: false });
  }, [update]);

  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const replaceModelFile = useCallback(
    (file: File) => {
      if (!isGlbFile(file)) {
        window.alert("Please choose a .glb file.");
        return;
      }
      if (!map) return;

      const coordinates = stateRef.current.coordinates;
      revokeObjectUrl();
      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;
      activeModelIdRef.current = UPLOAD_MODEL_ID;

      withMap(map, (liveMap) => {
        setModelFeature(
          liveMap,
          UPLOAD_MODEL_ID,
          objectUrl,
          coordinates,
          stateRef.current,
        );
      });

      update({
        modelUri: objectUrl,
        modelLabel: file.name,
        modelPlaced: true,
      });
    },
    [map, revokeObjectUrl, update],
  );

  const copyProps = useCallback((): Record<string, unknown> | void => {
    if (!map || !state.modelPlaced) return;
    try {
      return paintPropsFromState(state);
    } catch {
      return;
    }
  }, [map, state]);

  // Eraser, draw, geocoder, initial van.glb placement, dblclick reposition
  useEffect(() => {
    if (!map || !isLoaded) return;

    let cancelled = false;
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
    });

    mapboxgl.accessToken = getMapboxToken();
    const geocoder = new MapboxGeocoder({
      accessToken: getMapboxToken(),
      mapboxgl: mapboxgl as never,
      marker: false,
    });

    map.addControl(draw, "top-right");
    map.addControl(geocoder, "top-right");
    map.doubleClickZoom.disable();

    const initLayersAndModel = () => {
      if (cancelled || !map.isStyleLoaded()) return;

      if (!map.getSource(ERASER_SOURCE_ID)) {
        map.addSource(ERASER_SOURCE_ID, {
          type: "geojson",
          data: emptyEraseArea,
        });
      }

      if (!map.getLayer(ERASER_LINE_LAYER_ID)) {
        map.addLayer({
          id: ERASER_LINE_LAYER_ID,
          type: "line",
          source: ERASER_SOURCE_ID,
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#333",
            "line-opacity": 0.15,
            "line-width": 4,
            "line-dasharray": [3, 2],
          },
        });
      }

      if (!map.getLayer(ERASER_CLIP_LAYER_ID)) {
        map.addLayer({
          id: ERASER_CLIP_LAYER_ID,
          type: "clip",
          source: ERASER_SOURCE_ID,
          layout: {
            "clip-layer-types": ["symbol", "model"],
            "clip-layer-scope": ["basemap"],
          },
        });
      }

      activeModelIdRef.current = DEFAULT_MODEL_ID;
      placeDefaultModel(map, stateRef.current);
      update({
        modelUri: DEFAULT_MODEL_URI,
        modelLabel: DEFAULT_MODEL_LABEL,
        coordinates: INITIAL_MODEL_COORDINATES,
        modelPlaced: true,
      });
    };

    if (map.isStyleLoaded()) {
      initLayersAndModel();
    } else {
      map.once("style.load", initLayersAndModel);
    }

    const onDrawCreate = (e: { features: GeoJSON.Feature[] }) => {
      const feature = e.features[0];
      if (!feature?.geometry) return;
      withMap(map, (liveMap) => {
        const source = liveMap.getSource(ERASER_SOURCE_ID) as
          | GeoJSONSource
          | undefined;
        source?.setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: feature.geometry,
            },
          ],
        });
      });
    };

    const onDrawDelete = () => {
      withMap(map, (liveMap) => {
        const source = liveMap.getSource(ERASER_SOURCE_ID) as
          | GeoJSONSource
          | undefined;
        source?.setData(emptyEraseArea);
      });
    };

    const onDblClick = (e: MapMouseEvent) => {
      if (cancelled) return;
      const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      const current = stateRef.current;
      withMap(map, (liveMap) => {
        setModelFeature(
          liveMap,
          activeModelIdRef.current,
          current.modelUri,
          coordinates,
          current,
        );
      });
      update({ coordinates, modelPlaced: true });
    };

    map.on("draw.create", onDrawCreate);
    map.on("draw.update", onDrawCreate);
    map.on("draw.delete", onDrawDelete);
    map.on("dblclick", onDblClick);

    return () => {
      cancelled = true;
      map.off("style.load", initLayersAndModel);
      revokeObjectUrl();
      withMap(map, (liveMap) => {
        liveMap.off("draw.create", onDrawCreate);
        liveMap.off("draw.update", onDrawCreate);
        liveMap.off("draw.delete", onDrawDelete);
        liveMap.off("dblclick", onDblClick);
        try {
          liveMap.removeControl(draw);
        } catch {
          // already removed
        }
        try {
          liveMap.removeControl(geocoder);
        } catch {
          // already removed
        }
        for (const id of [
          MODEL_LAYER_ID,
          ERASER_CLIP_LAYER_ID,
          ERASER_LINE_LAYER_ID,
        ]) {
          if (liveMap.getLayer(id)) liveMap.removeLayer(id);
        }
        for (const id of [MODEL_SOURCE_ID, ERASER_SOURCE_ID]) {
          if (liveMap.getSource(id)) liveMap.removeSource(id);
        }
        for (const modelId of [DEFAULT_MODEL_ID, UPLOAD_MODEL_ID]) {
          if (liveMap.hasModel(modelId)) {
            try {
              liveMap.removeModel(modelId);
            } catch {
              // ignore
            }
          }
        }
        try {
          liveMap.doubleClickZoom.enable();
        } catch {
          // destroyed
        }
      });
    };
  }, [map, isLoaded, update, revokeObjectUrl]);

  // Sync paint props when sliders/color change
  useEffect(() => {
    if (!map || !state.modelPlaced) return;
    withMap(map, (liveMap) => {
      applyPaintFromState(liveMap, state);
    });
  }, [
    map,
    state.modelPlaced,
    state.rotation,
    state.scale,
    state.colorMixIntensity,
    state.opacity,
    state.color,
  ]);

  // Light preset
  useEffect(() => {
    if (!map || !isLoaded) return;
    applyStandardLightPreset(map, state.dayPreset ? "day" : "night");
  }, [map, isLoaded, state.dayPreset]);

  return {
    state,
    update,
    dismissIntro,
    replaceModelFile,
    copyProps,
    coordsLabel: formatCoords(state.coordinates),
  };
}
