import type { LngLatLike, Map, MapOptions } from "mapbox-gl";

export const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/standard";

export const DEFAULT_MAP_OPTIONS: Partial<MapOptions> = {
  style: DEFAULT_MAP_STYLE,
  cooperativeGestures: true,
};

export function applyStandardLightPreset(map: Map, preset: "day" | "night"): void {
  if (!map.isStyleLoaded()) return;
  try {
    map.setConfigProperty("basemap", "lightPreset", preset);
  } catch {
    // Standard style config not available on all styles
  }
}

export type DemoViewport = {
  center: LngLatLike;
  zoom: number;
  bearing?: number;
  pitch?: number;
};

export const vegasLineDesignerViewport: DemoViewport = {
  center: [-115.173458, 36.11549],
  zoom: 17,
  bearing: 149,
  pitch: 52,
};
