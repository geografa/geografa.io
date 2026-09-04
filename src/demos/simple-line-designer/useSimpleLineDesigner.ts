import { useCallback, useEffect, useState } from "react";
import type { Map } from "mapbox-gl";
import {
  addGeoJSONSource,
  addLineLayer,
  fetchGeoJSON,
  setLayerVisibility,
} from "@/lib/map";
import { applyStandardLightPreset } from "@/lib/map/defaults";
import { mapColors } from "@/theme";

export const LINE_LAYER_ID = "line-layer";
export const LINE_CASING_LAYER_ID = "line-layer-casing";
export const LINE_SOURCE_ID = "line-source";

const GEOJSON_URL = "/demos/simple-line-designer/data/vegas_line.geojson";

export interface LineDesignerState {
  lineWidth: number;
  lineBlur: number;
  lineOpacity: number;
  lineEmissiveStrength: number;
  lineZOffset: number;
  casingWidth: number;
  casingBlur: number;
  casingOpacity: number;
  casingOffset: number;
  casingVisible: boolean;
  dayPreset: boolean;
}

const initialState: LineDesignerState = {
  lineWidth: 7,
  lineBlur: 0,
  lineOpacity: 1,
  lineEmissiveStrength: 0,
  lineZOffset: 0,
  casingWidth: 10,
  casingBlur: 0,
  casingOpacity: 1,
  casingOffset: 0,
  casingVisible: true,
  dayPreset: true,
};

function mapIsUsable(map: Map | null): map is Map {
  try {
    return Boolean(map?.getStyle());
  } catch {
    return false;
  }
}

export function useSimpleLineDesigner(map: Map | null, isLoaded: boolean) {
  const [state, setState] = useState<LineDesignerState>(initialState);
  const [layersReady, setLayersReady] = useState(false);

  useEffect(() => {
    if (!mapIsUsable(map) || !isLoaded || layersReady) return;

    let cancelled = false;

    fetchGeoJSON(GEOJSON_URL)
      .then((data) => {
        if (cancelled) return;

        addGeoJSONSource(map, LINE_SOURCE_ID, data);

        const lineLayout = {
          "line-join": "round" as const,
          "line-cap": "round" as const,
          "line-z-offset": initialState.lineZOffset,
        };

        addLineLayer(map, LINE_CASING_LAYER_ID, LINE_SOURCE_ID, lineLayout, {
          "line-color": mapColors.boundary,
          "line-width": initialState.casingWidth,
          "line-blur": initialState.casingBlur,
          "line-opacity": initialState.casingOpacity,
          "line-offset": initialState.casingOffset,
        });

        addLineLayer(map, LINE_LAYER_ID, LINE_SOURCE_ID, lineLayout, {
          "line-color": mapColors.highlight,
          "line-width": initialState.lineWidth,
          "line-opacity": initialState.lineOpacity,
          "line-blur": initialState.lineBlur,
          "line-offset": 0,
          "line-emissive-strength": initialState.lineEmissiveStrength,
        });

        setLayersReady(true);
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [map, isLoaded, layersReady]);

  useEffect(() => {
    if (!mapIsUsable(map) || !layersReady) return;

    return () => {
      if (!mapIsUsable(map)) return;
      if (map.getLayer(LINE_LAYER_ID)) map.removeLayer(LINE_LAYER_ID);
      if (map.getLayer(LINE_CASING_LAYER_ID)) {
        map.removeLayer(LINE_CASING_LAYER_ID);
      }
      if (map.getSource(LINE_SOURCE_ID)) map.removeSource(LINE_SOURCE_ID);
    };
  }, [map, layersReady]);

  useEffect(() => {
    if (!mapIsUsable(map) || !layersReady) return;

    map.setPaintProperty(LINE_LAYER_ID, "line-width", state.lineWidth);
    map.setPaintProperty(LINE_LAYER_ID, "line-blur", state.lineBlur);
    map.setPaintProperty(LINE_LAYER_ID, "line-opacity", state.lineOpacity);
    map.setPaintProperty(
      LINE_LAYER_ID,
      "line-emissive-strength",
      state.lineEmissiveStrength,
    );
    map.setLayoutProperty(LINE_LAYER_ID, "line-z-offset", state.lineZOffset);

    map.setPaintProperty(LINE_CASING_LAYER_ID, "line-width", state.casingWidth);
    map.setPaintProperty(LINE_CASING_LAYER_ID, "line-blur", state.casingBlur);
    map.setPaintProperty(
      LINE_CASING_LAYER_ID,
      "line-opacity",
      state.casingOpacity,
    );
    map.setPaintProperty(
      LINE_CASING_LAYER_ID,
      "line-offset",
      state.casingOffset,
    );

    setLayerVisibility(map, LINE_CASING_LAYER_ID, state.casingVisible);
  }, [
    map,
    layersReady,
    state.lineWidth,
    state.lineBlur,
    state.lineOpacity,
    state.lineEmissiveStrength,
    state.lineZOffset,
    state.casingWidth,
    state.casingBlur,
    state.casingOpacity,
    state.casingOffset,
    state.casingVisible,
  ]);

  useEffect(() => {
    if (!mapIsUsable(map) || !layersReady) return;
    applyStandardLightPreset(map, state.dayPreset ? "day" : "night");
  }, [map, layersReady, state.dayPreset]);

  const update = useCallback((patch: Partial<LineDesignerState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const copyProps = useCallback((): Record<string, unknown> => {
    if (!map || !layersReady) return {};
    return {
      "line-width": map.getPaintProperty(LINE_LAYER_ID, "line-width"),
      "line-blur": map.getPaintProperty(LINE_LAYER_ID, "line-blur"),
      "line-opacity": map.getPaintProperty(LINE_LAYER_ID, "line-opacity"),
      "line-emissive-strength": map.getPaintProperty(
        LINE_LAYER_ID,
        "line-emissive-strength",
      ),
      "line-z-offset": map.getLayoutProperty(LINE_LAYER_ID, "line-z-offset"),
      "line-casing-width": map.getPaintProperty(
        LINE_CASING_LAYER_ID,
        "line-width",
      ),
      "line-casing-blur": map.getPaintProperty(
        LINE_CASING_LAYER_ID,
        "line-blur",
      ),
      "line-casing-opacity": map.getPaintProperty(
        LINE_CASING_LAYER_ID,
        "line-opacity",
      ),
      "line-casing-offset": map.getPaintProperty(
        LINE_CASING_LAYER_ID,
        "line-offset",
      ),
    };
  }, [map, layersReady]);

  return { state, update, copyProps, layersReady };
}
