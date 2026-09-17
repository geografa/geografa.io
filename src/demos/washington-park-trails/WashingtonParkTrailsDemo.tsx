import { useEffect, useState } from "react";
import type { Map } from "mapbox-gl";
import { MapCanvas, MapDemoShell } from "@/components/map";
import { TrailsPanel } from "./TrailsPanel";
import { TRAILS_MAP_STYLE, TRAILS_MAX_ZOOM, TRAILS_VIEWPORT } from "./types";
import { useWashingtonParkTrails } from "./useWashingtonParkTrails";
import "@/styles/washington-park-trails.css";

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

function TrailsContent({ map, isLoaded }: { map: Map; isLoaded: boolean }) {
  const controls = useWashingtonParkTrails(map, isLoaded);
  return <TrailsPanel controls={controls} />;
}

export function WashingtonParkTrailsDemo() {
  const [mapCtx, setMapCtx] = useState<{
    map: Map;
    isLoaded: boolean;
  } | null>(null);

  return (
    <MapDemoShell
      title="Washington Park Trails, Portland OR"
      map={
        <MapCanvas
          style={TRAILS_MAP_STYLE}
          {...TRAILS_VIEWPORT}
          maxZoom={TRAILS_MAX_ZOOM}
          cooperativeGestures={false}
        >
          {({ map, isLoaded }) => (
            <MapContextSync map={map} isLoaded={isLoaded} onReady={setMapCtx} />
          )}
        </MapCanvas>
      }
      sidebar={
        mapCtx?.isLoaded ? (
          <TrailsContent map={mapCtx.map} isLoaded={mapCtx.isLoaded} />
        ) : null
      }
    />
  );
}
