import { useEffect, useRef, useState } from "react";
import type { Map } from "mapbox-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { MapCanvas, MapDemoShell } from "@/components/map";
import { FWC_MAP_STYLE, FWC_VIEWPORT } from "./types";
import { FwcTravelPanel } from "./FwcTravelPanel";
import { useFwcTravelTimes } from "./useFwcTravelTimes";
import "@/styles/fwc-demo.css";

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

function FwcMapContent({ map, isLoaded }: { map: Map; isLoaded: boolean }) {
  const geocoderRef = useRef<HTMLDivElement>(null);
  const { details } = useFwcTravelTimes(map, isLoaded, geocoderRef);

  return <FwcTravelPanel details={details} geocoderRef={geocoderRef} />;
}

export function FwcTravelTimesDemo() {
  const [mapCtx, setMapCtx] = useState<{
    map: Map;
    isLoaded: boolean;
  } | null>(null);

  return (
    <MapDemoShell
      title="Travel Times"
      map={
        <MapCanvas
          style={FWC_MAP_STYLE}
          {...FWC_VIEWPORT}
          cooperativeGestures={false}
          attributionControl={false}
        >
          {({ map, isLoaded }) => (
            <MapContextSync map={map} isLoaded={isLoaded} onReady={setMapCtx} />
          )}
        </MapCanvas>
      }
      sidebar={
        mapCtx?.isLoaded ? (
          <FwcMapContent map={mapCtx.map} isLoaded={mapCtx.isLoaded} />
        ) : null
      }
    />
  );
}
