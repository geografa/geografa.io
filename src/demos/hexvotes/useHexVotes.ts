import { useCallback, useEffect, useRef, useState } from "react";
import type { GeoJSONSource, Map, MapLayerMouseEvent } from "mapbox-gl";
import { withMap } from "@/lib/map";
import {
  buildBoard,
  claimHex,
  computeWinnerHighlight,
  emptyLongest,
} from "./game";
import {
  HEX_LAYER_ID,
  HEX_SOURCE_ID,
  LONGEST_FILL_LAYER_ID,
  LONGEST_OUTLINE_LAYER_ID,
  LONGEST_SOURCE_ID,
  PATH_GOLD,
  REGION_DATA_URL,
  TEAM_BLUE,
  TEAM_GRAY,
  TEAM_RED,
  type ClaimedTeam,
  type HexFeatureCollection,
  type HexRegion,
  type WinnerInfo,
} from "./types";

export type HexVotesControls = {
  region: HexRegion;
  resolution: number;
  nextTeam: ClaimedTeam;
  loading: boolean;
  error: string | null;
  winner: WinnerInfo | null;
  setRegion: (region: HexRegion) => void;
  setResolution: (resolution: number) => void;
  setNextTeam: (team: ClaimedTeam) => void;
  playAgain: () => void;
  dismissWinner: () => void;
};

function setSourceData(
  map: Map,
  sourceId: string,
  data: HexFeatureCollection,
): void {
  const source = map.getSource(sourceId) as GeoJSONSource | undefined;
  if (source) {
    source.setData(data);
  }
}

function ensureLayers(map: Map): void {
  if (!map.getSource(HEX_SOURCE_ID)) {
    map.addSource(HEX_SOURCE_ID, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
  }

  if (!map.getLayer(HEX_LAYER_ID)) {
    map.addLayer({
      id: HEX_LAYER_ID,
      type: "fill-extrusion",
      source: HEX_SOURCE_ID,
      paint: {
        "fill-extrusion-height": [
          "case",
          ["==", ["get", "team"], TEAM_GRAY],
          0,
          ["==", ["get", "team"], TEAM_RED],
          20000,
          30000,
        ],
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": 0.5,
        "fill-extrusion-color": [
          "case",
          ["==", ["get", "team"], TEAM_RED],
          TEAM_RED,
          ["==", ["get", "team"], TEAM_BLUE],
          TEAM_BLUE,
          TEAM_GRAY,
        ],
        "fill-extrusion-emissive-strength": 1,
      },
    });
  }

  if (!map.getSource(LONGEST_SOURCE_ID)) {
    map.addSource(LONGEST_SOURCE_ID, {
      type: "geojson",
      data: emptyLongest,
    });
  }

  if (!map.getLayer(LONGEST_OUTLINE_LAYER_ID)) {
    map.addLayer({
      id: LONGEST_OUTLINE_LAYER_ID,
      type: "line",
      source: LONGEST_SOURCE_ID,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": PATH_GOLD,
        "line-width": 4,
        "line-opacity": 0.95,
      },
    });
  }

  if (!map.getLayer(LONGEST_FILL_LAYER_ID)) {
    map.addLayer({
      id: LONGEST_FILL_LAYER_ID,
      type: "fill-extrusion",
      source: LONGEST_SOURCE_ID,
      paint: {
        "fill-extrusion-color": PATH_GOLD,
        "fill-extrusion-height": 40000,
        "fill-extrusion-opacity": 0.35,
        "fill-extrusion-emissive-strength": 1,
      },
    });
  }
}

export function useHexVotes(map: Map | null, isLoaded: boolean): HexVotesControls {
  const boardRef = useRef<HexFeatureCollection>(emptyLongest);
  const lastWinnerKeyRef = useRef<string | null>(null);
  const [region, setRegionState] = useState<HexRegion>("lower48");
  const [resolution, setResolutionState] = useState(1);
  const [nextTeam, setNextTeam] = useState<ClaimedTeam>(TEAM_RED);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<WinnerInfo | null>(null);

  const rebuildBoard = useCallback(
    async (nextRegion: HexRegion, nextResolution: number) => {
      if (!map) return;
      setLoading(true);
      setError(null);
      setWinner(null);
      lastWinnerKeyRef.current = null;

      try {
        const response = await fetch(REGION_DATA_URL[nextRegion]);
        if (!response.ok) {
          throw new Error(`Failed to load ${nextRegion} boundary`);
        }
        const boundary = (await response.json()) as GeoJSON.FeatureCollection;
        const board = buildBoard(boundary, nextResolution);
        boardRef.current = board;

        withMap(map, (liveMap) => {
          ensureLayers(liveMap);
          setSourceData(liveMap, HEX_SOURCE_ID, board);
          setSourceData(liveMap, LONGEST_SOURCE_ID, emptyLongest);
        });
        setNextTeam(TEAM_RED);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [map],
  );

  useEffect(() => {
    if (!map || !isLoaded) return;

    let cancelled = false;
    let didSetup = false;

    const setup = () => {
      if (cancelled || didSetup || !map.isStyleLoaded()) return;
      didSetup = true;
      map.doubleClickZoom.disable();
      ensureLayers(map);
      void rebuildBoard("lower48", 1);
    };

    map.on("style.load", setup);
    map.on("idle", setup);
    setup();

    return () => {
      cancelled = true;
      map.off("style.load", setup);
      map.off("idle", setup);
      withMap(map, (liveMap) => {
        for (const layerId of [
          LONGEST_FILL_LAYER_ID,
          LONGEST_OUTLINE_LAYER_ID,
          HEX_LAYER_ID,
        ]) {
          if (liveMap.getLayer(layerId)) liveMap.removeLayer(layerId);
        }
        for (const sourceId of [LONGEST_SOURCE_ID, HEX_SOURCE_ID]) {
          if (liveMap.getSource(sourceId)) liveMap.removeSource(sourceId);
        }
      });
    };
  }, [map, isLoaded, rebuildBoard]);

  useEffect(() => {
    if (!map || !isLoaded) return;

    const onClick = (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature || feature.id === undefined) return;
      if (feature.properties?.team !== TEAM_GRAY) return;

      const claimed = claimHex(boardRef.current, feature.id, nextTeam);
      boardRef.current = claimed;
      setSourceData(map, HEX_SOURCE_ID, claimed);

      setNextTeam(nextTeam === TEAM_RED ? TEAM_BLUE : TEAM_RED);

      const { longest, winner: nextWinner } = computeWinnerHighlight(claimed);
      setSourceData(map, LONGEST_SOURCE_ID, longest);

      if (nextWinner) {
        const key = `${nextWinner.team}:${nextWinner.pathLength}`;
        if (lastWinnerKeyRef.current !== key) {
          lastWinnerKeyRef.current = key;
          setWinner(nextWinner);
        }
      } else {
        setWinner(null);
      }
    };

    const onEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const onLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", HEX_LAYER_ID, onClick);
    map.on("mouseenter", HEX_LAYER_ID, onEnter);
    map.on("mouseleave", HEX_LAYER_ID, onLeave);

    return () => {
      map.off("click", HEX_LAYER_ID, onClick);
      map.off("mouseenter", HEX_LAYER_ID, onEnter);
      map.off("mouseleave", HEX_LAYER_ID, onLeave);
      map.getCanvas().style.cursor = "";
    };
  }, [map, isLoaded, nextTeam]);

  const setRegion = useCallback(
    (nextRegion: HexRegion) => {
      setRegionState(nextRegion);
      void rebuildBoard(nextRegion, resolution);
    },
    [rebuildBoard, resolution],
  );

  const setResolution = useCallback(
    (nextResolution: number) => {
      setResolutionState(nextResolution);
      void rebuildBoard(region, nextResolution);
    },
    [rebuildBoard, region],
  );

  const playAgain = useCallback(() => {
    void rebuildBoard(region, resolution);
  }, [rebuildBoard, region, resolution]);

  const dismissWinner = useCallback(() => setWinner(null), []);

  return {
    region,
    resolution,
    nextTeam,
    loading,
    error,
    winner,
    setRegion,
    setResolution,
    setNextTeam,
    playAgain,
    dismissWinner,
  };
}
