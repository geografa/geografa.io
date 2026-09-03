import type {
  GeoJSONSourceSpecification,
  LineLayerSpecification,
  Map,
} from "mapbox-gl";

export async function fetchGeoJSON(url: string): Promise<GeoJSON.GeoJSON> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load GeoJSON: ${url}`);
  }
  return response.json() as Promise<GeoJSON.GeoJSON>;
}

export function addGeoJSONSource(
  map: Map,
  sourceId: string,
  data: GeoJSON.GeoJSON | string,
): void {
  if (map.getSource(sourceId)) return;

  const spec: GeoJSONSourceSpecification =
    typeof data === "string"
      ? { type: "geojson", data }
      : { type: "geojson", data };

  map.addSource(sourceId, spec);
}

export function addLineLayer(
  map: Map,
  layerId: string,
  sourceId: string,
  layout: LineLayerSpecification["layout"] = {},
  paint: LineLayerSpecification["paint"] = {},
): void {
  if (map.getLayer(layerId)) return;

  map.addLayer({
    id: layerId,
    type: "line",
    source: sourceId,
    layout,
    paint,
  });
}

export function setPaintProperties(
  map: Map,
  layerId: string,
  properties: Record<string, unknown>,
): void {
  if (!map.getLayer(layerId)) return;
  for (const [key, value] of Object.entries(properties)) {
    map.setPaintProperty(
      layerId,
      key as Parameters<Map["setPaintProperty"]>[1],
      value as Parameters<Map["setPaintProperty"]>[2],
    );
  }
}

export function setLayoutProperties(
  map: Map,
  layerId: string,
  properties: Record<string, unknown>,
): void {
  if (!map.getLayer(layerId)) return;
  for (const [key, value] of Object.entries(properties)) {
    map.setLayoutProperty(
      layerId,
      key as Parameters<Map["setLayoutProperty"]>[1],
      value as Parameters<Map["setLayoutProperty"]>[2],
    );
  }
}

export function setLayerVisibility(
  map: Map,
  layerId: string,
  visible: boolean,
): void {
  if (!map.getLayer(layerId)) return;
  map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
}
