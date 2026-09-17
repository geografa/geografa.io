import type { ExpressionSpecification } from "mapbox-gl";
import type { DemoViewport } from "@/lib/map";

export const LIGHTS_SOURCE_ID = "boise-lights";
export const LIGHTS_LAYER_ID = "boise-lights";
export const LIGHTS_BLUR_LAYER_ID = "boise-lights-blurred";
export const LIGHTS_SOURCE_LAYER = "boise-streetlights";
export const LIGHTS_TILESET_URL = "mapbox://grafa.1q37clbn";

export const BOISE_LIGHTS_MAP_STYLE =
  "mapbox://styles/grafa/cme0m3w9n01b501qpb61gciuj";

export const BOISE_LIGHTS_VIEWPORT: DemoViewport = {
  center: [-116.226844, 43.598527],
  zoom: 11,
  bearing: 0,
  pitch: 38,
};

export const BOISE_LIGHTS_MIN_ZOOM = 11.2;
export const BOISE_LIGHTS_MAX_ZOOM = 17;

/** Kelvin color temperature → streetlight glow color. */
export const KELVIN_CIRCLE_COLOR: ExpressionSpecification = [
  "case",
  [">", ["to-number", ["get", "Kelvins"]], 6500],
  "rgb(160, 210, 255)",
  [">=", ["to-number", ["get", "Kelvins"]], 5000],
  "rgb(201, 226, 255)",
  [">=", ["to-number", ["get", "Kelvins"]], 4000],
  "rgb(255, 241, 224)",
  [">=", ["to-number", ["get", "Kelvins"]], 3000],
  "rgb(255, 197, 143)",
  "rgb(255, 138, 18)",
];

export const EMISSIVE_FLICKER_VALUES = [0.5, 1, 1] as const;
export const EMISSIVE_FLICKER_MS = 800;
