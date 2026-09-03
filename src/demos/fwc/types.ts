export type FwcLayerKind = "stadiums" | "airports" | "basecamps" | "hotels";

export type DistanceKey = "stadium" | "airport" | "basecamp" | "hotel";

export interface DistanceRow {
  key: DistanceKey;
  name: string;
  minutes: string;
  miles: string;
}

export interface FwcDetails {
  name: string;
  city: string;
  rows: Partial<Record<DistanceKey, DistanceRow>>;
}

export interface FwcFeatureCollection extends GeoJSON.FeatureCollection {
  features: GeoJSON.Feature<GeoJSON.Point>[];
}

export const FWC_LAYER_IDS = {
  stadiums: "stadiums-layer",
  airports: "airports-layer",
  basecamps: "basecamp-layer",
  hotels: "hotels-layer",
} as const;

export const FWC_SOURCE_IDS = {
  stadiums: "stadiums-source",
  airports: "airport-source",
  basecamps: "basecamp-source",
  hotels: "hotels-source",
} as const;

export const FWC_DATA_URLS = {
  hostCities: "/demos/fwc/data/hostCities.geojson",
  basecamps: "/demos/fwc/data/basecamps.geojson",
  airports: "/demos/fwc/data/airports_nearby.geojson",
  hotels: "/demos/fwc/data/hotels.geojson",
} as const;

export const FWC_ICON_IDS = [
  "sq-stadium",
  "sq-soccer",
  "sq-hotel",
  "sq-airport",
] as const;

export const FWC_MAP_STYLE =
  "mapbox://styles/grafa/cmb5lcz4m00hp01sy4uamgt72";

export const FWC_VIEWPORT = {
  center: [-99.937616, 37.524855] as [number, number],
  zoom: 3,
  bearing: 0,
  pitch: 0,
};
