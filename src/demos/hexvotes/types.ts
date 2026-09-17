import type { DemoViewport } from "@/lib/map";

export const TEAM_RED = "#ff0000";
export const TEAM_BLUE = "#1da0e2";
export const TEAM_GRAY = "#dfdfdf";
export const PATH_GOLD = "#FFD700";

export type TeamColor = typeof TEAM_RED | typeof TEAM_BLUE | typeof TEAM_GRAY;
export type ClaimedTeam = typeof TEAM_RED | typeof TEAM_BLUE;
export type HexRegion = "lower48" | "tx";

export const HEX_SOURCE_ID = "hex";
export const HEX_LAYER_ID = "polygon";
export const LONGEST_SOURCE_ID = "longest";
export const LONGEST_OUTLINE_LAYER_ID = "longest-outline";
export const LONGEST_FILL_LAYER_ID = "longest-fill";

export const HEXVOTES_MAP_STYLE =
  "mapbox://styles/grafa/cmf4eviyt01gs01qnfs4xg3tb";

export const HEXVOTES_VIEWPORT: DemoViewport = {
  center: [-101.15771148626874, 35.044366956308764],
  zoom: 3,
  bearing: 0,
  pitch: 0,
};

export const REGION_OPTIONS: { value: HexRegion; label: string }[] = [
  { value: "lower48", label: "US" },
  { value: "tx", label: "Texas" },
];

export const REGION_DATA_URL: Record<HexRegion, string> = {
  lower48: "/demos/hexvotes/lower48.geojson",
  tx: "/demos/hexvotes/tx.geojson",
};

export type HexProperties = {
  votes: number;
  team: TeamColor;
  hexID: string;
};

export type HexFeature = GeoJSON.Feature<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  HexProperties
>;

export type HexFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  HexProperties
>;

export type WinnerInfo = {
  team: ClaimedTeam;
  pathLength: number;
};

export function teamLabel(team: ClaimedTeam): "Red" | "Blue" {
  return team === TEAM_RED ? "Red" : "Blue";
}
