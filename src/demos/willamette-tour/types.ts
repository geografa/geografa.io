import type { DemoViewport } from "@/lib/map";

export const WILLAMETTE_TOUR_MAP_STYLE =
  "mapbox://styles/grafa/cmuiocwe9000001sm4afj2yz4";

export type WillametteStop = {
  id: string;
  label: string;
  viewport: DemoViewport;
};

/** Camera strings are Mapbox hash form: zoom/lat/lng/bearing/pitch */
export const WILLAMETTE_TOUR_STOPS: WillametteStop[] = [
  {
    id: "oregon-city",
    label: "Oregon City",
    viewport: {
      center: [-122.60739, 45.36279],
      zoom: 13.62,
      bearing: 0,
      pitch: 44,
    },
  },
  {
    id: "lake-oswego",
    label: "Lake Oswego",
    viewport: {
      center: [-122.65148, 45.4065],
      zoom: 14.28,
      bearing: -142.5,
      pitch: 31,
    },
  },
  {
    id: "ross-island",
    label: "Ross Island",
    viewport: {
      center: [-122.66419, 45.4754],
      zoom: 13.82,
      bearing: -23.8,
      pitch: 60,
    },
  },
  {
    id: "downtown",
    label: "Downtown Portland",
    viewport: {
      center: [-122.66895, 45.52855],
      zoom: 14.1,
      bearing: -45.9,
      pitch: 59,
    },
  },
  {
    id: "swan-island",
    label: "Swan Island",
    viewport: {
      center: [-122.72515, 45.56941],
      zoom: 13.19,
      bearing: 0,
      pitch: 61,
    },
  },
  {
    id: "terminal-4",
    label: "Terminal 4",
    viewport: {
      center: [-122.77673, 45.59853],
      zoom: 13.25,
      bearing: -51.2,
      pitch: 60,
    },
  },
  {
    id: "kelley-point",
    label: "Kelley Point",
    viewport: {
      center: [-122.75973, 45.64775],
      zoom: 13.25,
      bearing: 161.6,
      pitch: 59,
    },
  },
];

export const WILLAMETTE_TOUR_VIEWPORT =
  WILLAMETTE_TOUR_STOPS[0].viewport;

export const WILLAMETTE_TOUR_FLY_DURATION_MS = 3500;

export const BATHYMETRY_LAYER_ID = "river-bathymetry-2001";

/** Color stops from the style fill-color interpolate on UPPER_ (ft). */
export const BATHYMETRY_LEGEND_STOPS = [
  { value: -90, color: "rgb(49, 110, 135)", label: "90 ft" },
  { value: -80, color: "rgb(61, 122, 147)", label: "80 ft" },
  { value: -70, color: "rgb(72, 134, 157)", label: "70 ft" },
  { value: -60, color: "rgb(84, 144, 166)", label: "60 ft" },
  { value: -50, color: "rgb(95, 158, 178)", label: "50 ft" },
  { value: -40, color: "rgb(107, 171, 190)", label: "40 ft" },
  { value: -30, color: "rgb(119, 184, 202)", label: "30 ft" },
  { value: -20, color: "rgb(131, 197, 214)", label: "20 ft" },
  { value: -10, color: "rgb(142, 211, 227)", label: "10 ft" },
  { value: 0, color: "rgb(154, 226, 239)", label: "0 ft" },
] as const;
