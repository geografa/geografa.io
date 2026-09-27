import { useEffect, useState } from "react";
import type { Map } from "mapbox-gl";
import { MapCanvas, MapDemoShell } from "@/components/map";
import { WillametteTourLegend } from "./WillametteTourLegend";
import { WillametteTourNav } from "./WillametteTourNav";
import {
  WILLAMETTE_TOUR_FLY_DURATION_MS,
  WILLAMETTE_TOUR_MAP_STYLE,
  WILLAMETTE_TOUR_STOPS,
  WILLAMETTE_TOUR_VIEWPORT,
  type WillametteStop,
} from "./types";
import { useWillametteBathymetry } from "./useWillametteBathymetry";
import "@/styles/willamette-tour.css";

function MapContextSync({
  map,
  isLoaded,
  onReady,
}: {
  map: Map;
  isLoaded: boolean;
  onReady: (ctx: { map: Map; isLoaded: boolean } | null) => void;
}) {
  useEffect(() => {
    onReady({ map, isLoaded });
    return () => onReady(null);
  }, [map, isLoaded, onReady]);

  return null;
}

function BathymetryEffects({ map, isLoaded }: { map: Map; isLoaded: boolean }) {
  useWillametteBathymetry(map, isLoaded);
  return null;
}

export function WillametteTourDemo() {
  const [mapCtx, setMapCtx] = useState<{
    map: Map;
    isLoaded: boolean;
  } | null>(null);
  const [activeId, setActiveId] = useState(WILLAMETTE_TOUR_STOPS[0].id);

  const handleSelect = (stop: WillametteStop) => {
    setActiveId(stop.id);
    if (!mapCtx?.map || !mapCtx.isLoaded) return;
    mapCtx.map.flyTo({
      center: stop.viewport.center,
      zoom: stop.viewport.zoom,
      bearing: stop.viewport.bearing,
      pitch: stop.viewport.pitch,
      duration: WILLAMETTE_TOUR_FLY_DURATION_MS,
      essential: true,
    });
  };

  return (
    <MapDemoShell
      title="Willamette River Bathymetry"
      map={
        <MapCanvas
          style={WILLAMETTE_TOUR_MAP_STYLE}
          {...WILLAMETTE_TOUR_VIEWPORT}
          cooperativeGestures={false}
        >
          {({ map, isLoaded }) => (
            <>
              <MapContextSync
                map={map}
                isLoaded={isLoaded}
                onReady={setMapCtx}
              />
              <BathymetryEffects map={map} isLoaded={isLoaded} />
            </>
          )}
        </MapCanvas>
      }
      sidebar={
        <>
          <WillametteTourNav
            stops={WILLAMETTE_TOUR_STOPS}
            activeId={activeId}
            onSelect={handleSelect}
          />
          <WillametteTourLegend />
        </>
      }
    />
  );
}
