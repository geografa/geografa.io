import { colors } from "./colors";

export const mapColors = {
  background: colors.cream,
  land: colors.muted,
  water: colors.ink,
  accent: colors.gold,
  highlight: colors.red,
  boundary: colors.cream,
  label: colors.ink,
} as const;

export type MapColor = keyof typeof mapColors;

/** Ready-made Mapbox GL / MapLibre paint expressions */
export const mapPaint = {
  landFill: ["fill-color", mapColors.land] as const,
  waterFill: ["fill-color", mapColors.water] as const,
  routeLine: ["line-color", mapColors.accent] as const,
  highlightLine: ["line-color", mapColors.highlight] as const,
  boundaryLine: ["line-color", mapColors.boundary] as const,
  labelText: ["text-color", mapColors.label] as const,
} as const;
