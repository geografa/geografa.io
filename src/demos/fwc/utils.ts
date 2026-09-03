import { getMapboxToken } from "@/config/env";
import type { DistanceKey, DistanceRow, FwcDetails, FwcFeatureCollection } from "./types";

export const metersToMiles = (m: number): string =>
  (m / 1609.344).toFixed(0);

export const secondsToMinutes = (s: number): string => (s / 60).toFixed(0);

export interface NearestResult {
  nearestLayer1: [number, number];
  nearestLayer2: [number, number];
  nearestLayer3: [number, number];
  featureLayer1: GeoJSON.Feature<GeoJSON.Point>;
  featureLayer2: GeoJSON.Feature<GeoJSON.Point>;
  featureLayer3: GeoJSON.Feature<GeoJSON.Point>;
}

export async function getMatrix1x4(
  sourceCoord: [number, number],
  dest1: [number, number],
  dest2: [number, number],
  dest3: [number, number],
): Promise<{ distances: number[][]; durations: number[][] }> {
  const token = getMapboxToken();
  const coords = [
    sourceCoord.join(","),
    dest1.join(","),
    dest2.join(","),
    dest3.join(","),
  ].join(";");

  const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coords}?sources=0&destinations=1;2;3&annotations=distance,duration&access_token=${token}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Matrix API request failed");
  }
  return response.json();
}

export function buildDistanceRow(
  key: DistanceKey,
  name: string,
  distanceMeters: number,
  durationSeconds: number,
): DistanceRow {
  return {
    key,
    name,
    minutes: secondsToMinutes(durationSeconds),
    miles: metersToMiles(distanceMeters),
  };
}

export function emptyDetails(): FwcDetails {
  return { name: "", city: "", rows: {} };
}

export function searchVenueFeatures(
  query: string,
  collections: FwcFeatureCollection[],
): GeoJSON.Feature[] {
  const matching: GeoJSON.Feature[] = [];
  const lower = query.toLowerCase();

  for (const collection of collections) {
    for (const feature of collection.features) {
      const name = feature.properties?.name;
      if (typeof name === "string" && name.toLowerCase().includes(lower)) {
        matching.push({
          ...feature,
          place_name: feature.properties?.iata_code
            ? `✈ ${name}`
            : `⚽ ${name}`,
          center: feature.geometry.coordinates,
        } as GeoJSON.Feature);
      }
    }
  }

  return matching;
}
