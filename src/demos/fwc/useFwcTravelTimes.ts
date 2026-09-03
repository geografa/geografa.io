import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import mapboxgl, { type Map } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import nearestPoint from "@turf/nearest-point";
import { point, featureCollection } from "@turf/helpers";
import { fetchGeoJSON, addMapImagesFromUrls } from "@/lib/map";
import { getMapboxToken } from "@/config/env";
import type {
  DistanceKey,
  FwcDetails,
  FwcFeatureCollection,
  FwcLayerKind,
} from "./types";
import {
  FWC_DATA_URLS,
  FWC_ICON_IDS,
  FWC_LAYER_IDS,
  FWC_SOURCE_IDS,
} from "./types";
import {
  buildDistanceRow,
  emptyDetails,
  getMatrix1x4,
  searchVenueFeatures,
  type NearestResult,
} from "./utils";

const ICON_LAYOUT = {
  "icon-size": 1,
  "icon-allow-overlap": true,
} as const;

const LAYER_ICON: Record<FwcLayerKind, string> = {
  stadiums: "sq-stadium",
  airports: "sq-airport",
  basecamps: "sq-soccer",
  hotels: "sq-hotel",
};

type ClickConfig = {
  nearestLayers: [
    FwcFeatureCollection,
    FwcFeatureCollection,
    FwcFeatureCollection,
  ];
  rowKeys: [DistanceKey, DistanceKey, DistanceKey];
  clearKey?: DistanceKey;
  flyToStadium?: boolean;
};

function getNearestFeatures(
  clicked: GeoJSON.Feature<GeoJSON.Point>,
  layer1: FwcFeatureCollection,
  layer2: FwcFeatureCollection,
  layer3: FwcFeatureCollection,
): NearestResult {
  const clickedPoint = point(clicked.geometry.coordinates);
  const nearest1 = nearestPoint(clickedPoint, featureCollection(layer1.features));
  const nearest2 = nearestPoint(clickedPoint, featureCollection(layer2.features));
  const nearest3 = nearestPoint(clickedPoint, featureCollection(layer3.features));

  return {
    nearestLayer1: nearest1.geometry.coordinates as [number, number],
    nearestLayer2: nearest2.geometry.coordinates as [number, number],
    nearestLayer3: nearest3.geometry.coordinates as [number, number],
    featureLayer1: nearest1,
    featureLayer2: nearest2,
    featureLayer3: nearest3,
  };
}

async function loadMapIcons(map: Map): Promise<void> {
  await addMapImagesFromUrls(
    map,
    FWC_ICON_IDS.map((id) => ({
      id,
      url: `/demos/fwc/img/${id}.svg`,
    })),
  );
}

function addSymbolLayer(
  map: Map,
  layerId: string,
  sourceId: string,
  iconImage: string,
): void {
  if (map.getLayer(layerId)) return;
  map.addLayer({
    id: layerId,
    type: "symbol",
    source: sourceId,
    layout: {
      "icon-image": iconImage,
      ...ICON_LAYOUT,
    },
  });
}

export function useFwcTravelTimes(
  map: Map | null,
  isLoaded: boolean,
  geocoderRef: RefObject<HTMLDivElement | null>,
) {
  const [details, setDetails] = useState<FwcDetails>(emptyDetails);
  const [layersReady, setLayersReady] = useState(false);
  const dataRef = useRef<{
    hostCities: FwcFeatureCollection;
    basecamps: FwcFeatureCollection;
    airports: FwcFeatureCollection;
    hotels: FwcFeatureCollection;
  } | null>(null);

  const handleLayerClick = useCallback(
    async (
      clicked: GeoJSON.Feature<GeoJSON.Point>,
      config: ClickConfig,
      displayName: string,
      displayCity = "",
    ) => {
      if (!map || !dataRef.current) return;

      const nearest = getNearestFeatures(
        clicked,
        ...config.nearestLayers,
      );

      if (config.flyToStadium) {
        map.flyTo({
          center: clicked.geometry.coordinates as [number, number],
          zoom: 17,
          pitch: 60,
          bearing: 0,
        });
      }

      try {
        const matrix = await getMatrix1x4(
          clicked.geometry.coordinates as [number, number],
          nearest.nearestLayer1,
          nearest.nearestLayer2,
          nearest.nearestLayer3,
        );

        const [key1, key2, key3] = config.rowKeys;
        const rows: FwcDetails["rows"] = {
          [key1]: buildDistanceRow(
            key1,
            String(nearest.featureLayer1.properties?.name ?? ""),
            matrix.distances[0][0],
            matrix.durations[0][0],
          ),
          [key2]: buildDistanceRow(
            key2,
            String(nearest.featureLayer2.properties?.name ?? ""),
            matrix.distances[0][1],
            matrix.durations[0][1],
          ),
          [key3]: buildDistanceRow(
            key3,
            String(nearest.featureLayer3.properties?.name ?? ""),
            matrix.distances[0][2],
            matrix.durations[0][2],
          ),
        };

        if (config.clearKey) {
          delete rows[config.clearKey];
        }

        setDetails({ name: displayName, city: displayCity, rows });
      } catch (err) {
        console.error("Matrix API error:", err);
        setDetails({ name: displayName, city: displayCity, rows: {} });
      }
    },
    [map],
  );

  useEffect(() => {
    if (!map || !isLoaded || layersReady) return;

    let cancelled = false;

    Promise.all([
      fetchGeoJSON(FWC_DATA_URLS.hostCities),
      fetchGeoJSON(FWC_DATA_URLS.basecamps),
      fetchGeoJSON(FWC_DATA_URLS.airports),
      fetchGeoJSON(FWC_DATA_URLS.hotels),
    ])
      .then(async ([hostCities, basecamps, airports, hotels]) => {
        if (cancelled) return;

        dataRef.current = {
          hostCities: hostCities as FwcFeatureCollection,
          basecamps: basecamps as FwcFeatureCollection,
          airports: airports as FwcFeatureCollection,
          hotels: hotels as FwcFeatureCollection,
        };

        await loadMapIcons(map);

        const datasets: [FwcLayerKind, FwcFeatureCollection][] = [
          ["hotels", dataRef.current.hotels],
          ["basecamps", dataRef.current.basecamps],
          ["airports", dataRef.current.airports],
          ["stadiums", dataRef.current.hostCities],
        ];

        for (const [kind, data] of datasets) {
          const sourceId = FWC_SOURCE_IDS[kind];
          const layerId = FWC_LAYER_IDS[kind];
          if (!map.getSource(sourceId)) {
            map.addSource(sourceId, { type: "geojson", data });
          }
          addSymbolLayer(map, layerId, sourceId, LAYER_ICON[kind]);
        }

        map.addControl(
          new mapboxgl.AttributionControl({
            compact: true,
            customAttribution: "Stadium Data: FIFA.com SportsData.io",
          }),
          "bottom-right",
        );

        setLayersReady(true);
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [map, isLoaded, layersReady]);

  useEffect(() => {
    if (!map || !layersReady || !dataRef.current) return;

    const { hostCities, basecamps, airports, hotels } = dataRef.current;

    const bindPointer = (layerId: string) => {
      const onEnter = () => {
        map.getCanvas().style.cursor = "pointer";
      };
      const onLeave = () => {
        map.getCanvas().style.cursor = "";
      };
      map.on("mouseenter", layerId, onEnter);
      map.on("mouseleave", layerId, onLeave);
      return () => {
        map.off("mouseenter", layerId, onEnter);
        map.off("mouseleave", layerId, onLeave);
      };
    };

    const onAirportClick = (e: mapboxgl.MapMouseEvent & { features?: GeoJSON.Feature[] }) => {
      const feature = e.features?.[0] as GeoJSON.Feature<GeoJSON.Point> | undefined;
      if (!feature) return;
      void handleLayerClick(
        feature,
        {
          nearestLayers: [hostCities, basecamps, hotels],
          rowKeys: ["stadium", "basecamp", "hotel"],
          clearKey: "airport",
        },
        String(feature.properties?.iata ?? feature.properties?.name ?? ""),
      );
    };

    const onBasecampClick = (e: mapboxgl.MapMouseEvent & { features?: GeoJSON.Feature[] }) => {
      const feature = e.features?.[0] as GeoJSON.Feature<GeoJSON.Point> | undefined;
      if (!feature) return;
      void handleLayerClick(
        feature,
        {
          nearestLayers: [hostCities, airports, hotels],
          rowKeys: ["stadium", "airport", "hotel"],
          clearKey: "basecamp",
        },
        String(feature.properties?.name ?? ""),
      );
    };

    const onHotelClick = (e: mapboxgl.MapMouseEvent & { features?: GeoJSON.Feature[] }) => {
      const feature = e.features?.[0] as GeoJSON.Feature<GeoJSON.Point> | undefined;
      if (!feature) return;
      void handleLayerClick(
        feature,
        {
          nearestLayers: [hostCities, airports, basecamps],
          rowKeys: ["stadium", "airport", "basecamp"],
          clearKey: "hotel",
        },
        String(feature.properties?.name ?? ""),
      );
    };

    const onStadiumClick = (e: mapboxgl.MapMouseEvent & { features?: GeoJSON.Feature[] }) => {
      const feature = e.features?.[0] as GeoJSON.Feature<GeoJSON.Point> | undefined;
      if (!feature) return;
      void handleLayerClick(
        feature,
        {
          nearestLayers: [airports, basecamps, hotels],
          rowKeys: ["airport", "basecamp", "hotel"],
          clearKey: "stadium",
          flyToStadium: true,
        },
        String(feature.properties?.name ?? ""),
      );
    };

    map.on("click", FWC_LAYER_IDS.airports, onAirportClick);
    map.on("click", FWC_LAYER_IDS.basecamps, onBasecampClick);
    map.on("click", FWC_LAYER_IDS.hotels, onHotelClick);
    map.on("click", FWC_LAYER_IDS.stadiums, onStadiumClick);

    const unbindPointer = [
      FWC_LAYER_IDS.airports,
      FWC_LAYER_IDS.basecamps,
      FWC_LAYER_IDS.hotels,
      FWC_LAYER_IDS.stadiums,
    ].flatMap((id) => {
      const cleanup = bindPointer(id);
      return [cleanup];
    });

    return () => {
      map.off("click", FWC_LAYER_IDS.airports, onAirportClick);
      map.off("click", FWC_LAYER_IDS.basecamps, onBasecampClick);
      map.off("click", FWC_LAYER_IDS.hotels, onHotelClick);
      map.off("click", FWC_LAYER_IDS.stadiums, onStadiumClick);
      unbindPointer.forEach((fn) => fn());
    };
  }, [map, layersReady, handleLayerClick]);

  useEffect(() => {
    if (!map || !layersReady || !geocoderRef.current || !dataRef.current) return;

    const collections = Object.values(dataRef.current);
    mapboxgl.accessToken = getMapboxToken();

    const geocoder = new MapboxGeocoder({
      accessToken: getMapboxToken(),
      localGeocoder: (query) =>
        searchVenueFeatures(query, collections) as never,
      types: "place,address",
      marker: false,
      placeholder: "City, Venue, or Airport",
      mapboxgl: mapboxgl as never,
    });

    geocoderRef.current.innerHTML = "";
    geocoderRef.current.appendChild(geocoder.onAdd(map));

    geocoder.on("result", (e) => {
      map.flyTo({ center: e.result.center as [number, number], zoom: 12 });
    });

    return () => {
      geocoder.onRemove();
    };
  }, [map, layersReady, geocoderRef]);

  return { details, layersReady };
}
