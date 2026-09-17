import { useCallback, useEffect, useRef, useState } from "react";
import { bbox } from "@turf/turf";
import mapboxgl, { type Map, type MapLayerMouseEvent } from "mapbox-gl";
import { fetchGeoJSON, withMap } from "@/lib/map";
import {
  DEFAULT_CASING_WIDTH,
  DEFAULT_LINE_COLOR,
  DEFAULT_LINE_WIDTH,
  TRAILS_CASING_LAYER_ID,
  TRAILS_DATA_URL,
  TRAILS_LABELS_LAYER_ID,
  TRAILS_LAYER_ID,
  TRAILS_SOURCE_ID,
  type TrailsFeatureCollection,
} from "./types";

export type TrailsControls = {
  trailNames: string[];
  selectedTrail: string | null;
  panelOpen: boolean;
  loading: boolean;
  error: string | null;
  selectTrail: (name: string) => void;
  clearSelection: () => void;
  setPanelOpen: (open: boolean) => void;
};

const TRAIL_HASH_PREFIX = "trail/";

function uniqueTrailNames(data: TrailsFeatureCollection): string[] {
  const names = data.features
    .map((feature) => feature.properties?.name)
    .filter((name): name is string => Boolean(name));

  return [...new Set(names)].sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" }),
  );
}

function readTrailHash(): string | null {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw.startsWith(TRAIL_HASH_PREFIX)) return null;
  try {
    const name = decodeURIComponent(raw.slice(TRAIL_HASH_PREFIX.length));
    return name || null;
  } catch {
    return null;
  }
}

function writeTrailHash(name: string | null): void {
  const nextHash = name
    ? `#${TRAIL_HASH_PREFIX}${encodeURIComponent(name)}`
    : "";
  if ((window.location.hash || "") === nextHash) return;
  const url = `${window.location.pathname}${window.location.search}${nextHash}`;
  window.history.replaceState(null, "", url);
}

function applyDefaultPaint(map: Map): void {
  map.setPaintProperty(TRAILS_LAYER_ID, "line-width", DEFAULT_LINE_WIDTH);
  map.setPaintProperty(TRAILS_LAYER_ID, "line-color", DEFAULT_LINE_COLOR);
  map.setPaintProperty(TRAILS_LAYER_ID, "line-dasharray", undefined);
  map.setPaintProperty(TRAILS_CASING_LAYER_ID, "line-width", DEFAULT_CASING_WIDTH);
  map.setPaintProperty(TRAILS_CASING_LAYER_ID, "line-color", "#fff");
  map.setFilter(TRAILS_LAYER_ID, null);
  map.setFilter(TRAILS_CASING_LAYER_ID, null);
  map.setFilter(TRAILS_LABELS_LAYER_ID, null);
}

function applySelectedPaint(map: Map, name: string): void {
  const filter: mapboxgl.FilterSpecification = ["==", ["get", "name"], name];
  map.setFilter(TRAILS_LAYER_ID, filter);
  map.setFilter(TRAILS_CASING_LAYER_ID, filter);
  map.setFilter(TRAILS_LABELS_LAYER_ID, filter);
  map.setPaintProperty(TRAILS_LAYER_ID, "line-width", 4);
  map.setPaintProperty(TRAILS_LAYER_ID, "line-color", "#ddd");
  map.setPaintProperty(TRAILS_LAYER_ID, "line-dasharray", [1, 3]);
  map.setPaintProperty(TRAILS_CASING_LAYER_ID, "line-width", 8);
  map.setPaintProperty(TRAILS_CASING_LAYER_ID, "line-color", "#ec6157");
}

function fitTrail(
  map: Map,
  data: TrailsFeatureCollection,
  name: string,
): void {
  const feature = data.features.find(
    (candidate) => candidate.properties?.name === name,
  );
  if (!feature) return;

  const [minX, minY, maxX, maxY] = bbox(feature);
  map.fitBounds(
    [
      [minX, minY],
      [maxX, maxY],
    ],
    {
      padding: 50,
      pitch: 60,
      maxZoom: 17,
      duration: 1200,
    },
  );
}

export function useWashingtonParkTrails(
  map: Map | null,
  isLoaded: boolean,
): TrailsControls {
  const [trailNames, setTrailNames] = useState<string[]>([]);
  const [selectedTrail, setSelectedTrail] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TrailsFeatureCollection | null>(null);
  const selectedTrailRef = useRef<string | null>(null);

  useEffect(() => {
    selectedTrailRef.current = selectedTrail;
  }, [selectedTrail]);

  useEffect(() => {
    if (!map || !isLoaded) return;

    let cancelled = false;
    let didSetup = false;
    let trailsData: TrailsFeatureCollection | null = null;
    let popup: mapboxgl.Popup | null = null;

    const activateTrail = (
      name: string,
      options: { syncHash?: boolean; collapsePanel?: boolean } = {},
    ) => {
      const { syncHash = true, collapsePanel = true } = options;
      if (!map.getLayer(TRAILS_LAYER_ID) || !trailsData) return;
      if (!uniqueTrailNames(trailsData).includes(name)) return;

      applySelectedPaint(map, name);
      fitTrail(map, trailsData, name);
      selectedTrailRef.current = name;
      setSelectedTrail(name);
      if (syncHash) writeTrailHash(name);
      if (collapsePanel && window.matchMedia("(max-width: 700px)").matches) {
        setPanelOpen(false);
      }
    };

    const clearTrail = (options: { syncHash?: boolean } = {}) => {
      const { syncHash = true } = options;
      if (!map.getLayer(TRAILS_LAYER_ID)) return;
      applyDefaultPaint(map);
      selectedTrailRef.current = null;
      setSelectedTrail(null);
      setPanelOpen(true);
      if (syncHash) writeTrailHash(null);
    };

    const setupLayers = (collection: TrailsFeatureCollection) => {
      if (cancelled || didSetup || !map.isStyleLoaded()) return;
      didSetup = true;

      if (!map.getSource(TRAILS_SOURCE_ID)) {
        map.addSource(TRAILS_SOURCE_ID, {
          type: "geojson",
          data: collection,
        });
      }

      if (!map.getLayer(TRAILS_CASING_LAYER_ID)) {
        map.addLayer({
          id: TRAILS_CASING_LAYER_ID,
          type: "line",
          source: TRAILS_SOURCE_ID,
          paint: {
            "line-color": "#fff",
            "line-width": DEFAULT_CASING_WIDTH,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
        });
      }

      if (!map.getLayer(TRAILS_LAYER_ID)) {
        map.addLayer({
          id: TRAILS_LAYER_ID,
          type: "line",
          source: TRAILS_SOURCE_ID,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": DEFAULT_LINE_COLOR,
            "line-width": DEFAULT_LINE_WIDTH,
          },
        });
      }

      if (!map.getLayer(TRAILS_LABELS_LAYER_ID)) {
        map.addLayer({
          id: TRAILS_LABELS_LAYER_ID,
          type: "symbol",
          source: TRAILS_SOURCE_ID,
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["Open Sans Regular"],
            "text-size": 12,
            "symbol-placement": "line",
          },
          paint: {
            "text-color": "#000",
            "text-halo-color": "#fff",
            "text-halo-width": 5,
            "text-halo-blur": 1,
          },
        });
      }

      const hashed = readTrailHash();
      if (hashed) {
        activateTrail(hashed, { syncHash: false, collapsePanel: false });
      }
    };

    const trySetup = () => {
      if (trailsData) setupLayers(trailsData);
    };

    const onTrailClick = (event: MapLayerMouseEvent) => {
      const name = event.features?.[0]?.properties?.name;
      if (!name) return;

      popup?.remove();
      const content = document.createElement("strong");
      content.textContent = name;
      popup = new mapboxgl.Popup({ closeOnClick: true })
        .setLngLat(event.lngLat)
        .setDOMContent(content)
        .addTo(map);
    };

    const onMapClick = (event: MapLayerMouseEvent) => {
      const hits = map.queryRenderedFeatures(event.point, {
        layers: map.getLayer(TRAILS_LAYER_ID) ? [TRAILS_LAYER_ID] : [],
      });
      if (hits.length > 0) return;
      setPanelOpen(true);
    };

    const onHashChange = () => {
      const hashed = readTrailHash();
      if (!hashed) {
        if (selectedTrailRef.current) clearTrail({ syncHash: false });
        return;
      }
      if (hashed === selectedTrailRef.current) return;
      activateTrail(hashed, { syncHash: false, collapsePanel: false });
    };

    const boot = async () => {
      try {
        const geojson = (await fetchGeoJSON(
          TRAILS_DATA_URL,
        )) as TrailsFeatureCollection;
        if (cancelled) return;

        trailsData = geojson;
        setData(geojson);
        setTrailNames(uniqueTrailNames(geojson));
        setLoading(false);

        map.on("style.load", trySetup);
        map.on("idle", trySetup);
        trySetup();
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    };

    void boot();
    map.on("click", TRAILS_LAYER_ID, onTrailClick);
    map.on("click", onMapClick);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      cancelled = true;
      map.off("style.load", trySetup);
      map.off("idle", trySetup);
      map.off("click", TRAILS_LAYER_ID, onTrailClick);
      map.off("click", onMapClick);
      window.removeEventListener("hashchange", onHashChange);
      popup?.remove();

      withMap(map, (liveMap) => {
        for (const layerId of [
          TRAILS_LABELS_LAYER_ID,
          TRAILS_LAYER_ID,
          TRAILS_CASING_LAYER_ID,
        ]) {
          if (liveMap.getLayer(layerId)) liveMap.removeLayer(layerId);
        }
        if (liveMap.getSource(TRAILS_SOURCE_ID)) {
          liveMap.removeSource(TRAILS_SOURCE_ID);
        }
      });
    };
  }, [map, isLoaded]);

  const selectTrail = useCallback(
    (name: string) => {
      if (!map || !data || !map.getLayer(TRAILS_LAYER_ID)) return;

      if (selectedTrail === name) {
        applyDefaultPaint(map);
        setSelectedTrail(null);
        setPanelOpen(true);
        writeTrailHash(null);
        return;
      }

      applySelectedPaint(map, name);
      fitTrail(map, data, name);
      setSelectedTrail(name);
      writeTrailHash(name);
      if (window.matchMedia("(max-width: 700px)").matches) {
        setPanelOpen(false);
      }
    },
    [map, data, selectedTrail],
  );

  const clearSelection = useCallback(() => {
    if (!map || !map.getLayer(TRAILS_LAYER_ID)) return;
    applyDefaultPaint(map);
    setSelectedTrail(null);
    setPanelOpen(true);
    writeTrailHash(null);
  }, [map]);

  return {
    trailNames,
    selectedTrail,
    panelOpen,
    loading,
    error,
    selectTrail,
    clearSelection,
    setPanelOpen,
  };
}
