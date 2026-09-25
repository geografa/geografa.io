import type { DemoViewport } from "@/lib/map";

export const WINTER_WONDERLAND_MAP_STYLE =
  "mapbox://styles/grafa/clolobt8m002l01r73orkhrgu";

export const WINTER_WONDERLAND_VIEWPORT: DemoViewport = {
  center: [-111.56789997610215, 40.67215157110007],
  zoom: 14.173322628842035,
  bearing: -137.37140680371726,
  pitch: 62.53570578270238,
};

/** Slow camera legs; last stop is always the origin so the loop restarts cleanly. */
export const WINTER_WONDERLAND_TOUR: DemoViewport[] = [
  {
    center: WINTER_WONDERLAND_VIEWPORT.center,
    zoom: 15.35,
    bearing: -95,
    pitch: 68,
  },
  {
    center: WINTER_WONDERLAND_VIEWPORT.center,
    zoom: 13.55,
    bearing: -178,
    pitch: 55,
  },
  {
    center: WINTER_WONDERLAND_VIEWPORT.center,
    zoom: 14.85,
    bearing: -230,
    pitch: 66,
  },
  { ...WINTER_WONDERLAND_VIEWPORT },
];

export const WINTER_WONDERLAND_TOUR_DURATION_MS = 14_000;