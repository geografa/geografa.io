import type { DemoViewport } from "@/lib/map";

export const GHOST_SOURCE_ID = "ghost-source";
export const GHOST_LAYER_ID = "ghost-layer";
export const GHOST_MODEL_ID = "ghost";
export const GHOST_MODEL_URI = "/demos/ghosts/models/ghost.glb";

export const GHOSTS_VIEWPORT: DemoViewport = {
  center: [-122.6562941, 45.54706036],
  zoom: 16.6,
  bearing: 133.9,
  pitch: 67,
};

export const GHOSTS_BBOX: [number, number, number, number] = [
  -122.65899, 45.53488, -122.63639, 45.54851,
];

export const GHOSTS_MAP_STYLE =
  "mapbox://styles/grafa/cm2ctot6900vn01om655a5yda";

export const GHOST_COUNT = 100;
