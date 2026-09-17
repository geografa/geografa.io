import { useEffect, useState } from "react";
import type { Map } from "mapbox-gl";
import { MapCanvas, MapDemoShell } from "@/components/map";
import { HexVotesPanel } from "./HexVotesPanel";
import { useHexVotes } from "./useHexVotes";
import { HEXVOTES_MAP_STYLE, HEXVOTES_VIEWPORT } from "./types";
import "@/styles/hexvotes.css";

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

function HexVotesContent({ map, isLoaded }: { map: Map; isLoaded: boolean }) {
  const controls = useHexVotes(map, isLoaded);
  return <HexVotesPanel controls={controls} />;
}

export function HexVotesDemo() {
  const [mapCtx, setMapCtx] = useState<{
    map: Map;
    isLoaded: boolean;
  } | null>(null);

  return (
    <MapDemoShell
      title="HexVotes"
      map={
        <MapCanvas
          style={HEXVOTES_MAP_STYLE}
          {...HEXVOTES_VIEWPORT}
          projection={{ name: "globe" }}
          lightPreset="night"
          cooperativeGestures={false}
        >
          {({ map, isLoaded }) => (
            <MapContextSync map={map} isLoaded={isLoaded} onReady={setMapCtx} />
          )}
        </MapCanvas>
      }
      sidebar={
        mapCtx?.isLoaded ? (
          <HexVotesContent map={mapCtx.map} isLoaded={mapCtx.isLoaded} />
        ) : null
      }
    />
  );
}
