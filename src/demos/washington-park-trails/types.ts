import type { ExpressionSpecification } from "mapbox-gl";
import type { DemoViewport } from "@/lib/map";

export const TRAILS_DATA_URL =
  "/demos/washington-park-trails/wa_park_trails.geojson";

export const TRAILS_SOURCE_ID = "wa_park_trails";
export const TRAILS_LAYER_ID = "wa_park_trails";
export const TRAILS_CASING_LAYER_ID = "wa_park_trails_casing";
export const TRAILS_LABELS_LAYER_ID = "wa_park_trails_labels";

export const TRAILS_MAP_STYLE =
  "mapbox://styles/grafa/cm102ki7h01y801pq09u4a1ug";

export const TRAILS_VIEWPORT: DemoViewport = {
  center: [-122.71197034995811, 45.51360311249525],
  zoom: 16,
  pitch: 60,
};

export const TRAILS_MAX_ZOOM = 17;

export const DEFAULT_LINE_COLOR = "#fc5078";

/** Solid trail width that thickens as you zoom in. */
export const DEFAULT_LINE_WIDTH: ExpressionSpecification = [
  "interpolate",
  ["linear"],
  ["zoom"],
  12,
  1.5,
  14,
  2.5,
  16,
  4,
  17,
  6,
];

export const DEFAULT_CASING_WIDTH: ExpressionSpecification = [
  "interpolate",
  ["linear"],
  ["zoom"],
  12,
  3,
  14,
  5,
  16,
  8,
  17,
  11,
];

export type TrailsFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.LineString | GeoJSON.MultiLineString,
  { name?: string; highway?: string; [key: string]: unknown }
>;
