import type { Map } from "mapbox-gl";
import { MapCanvas, MapDemoShell } from "@/components/map";
import { GHOSTS_MAP_STYLE, GHOSTS_VIEWPORT } from "./types";
import { useGhosts } from "./useGhosts";

function GhostsMapEffects({
  map,
  isLoaded,
}: {
  map: Map;
  isLoaded: boolean;
}) {
  useGhosts(map, isLoaded);
  return null;
}

export function GhostsDemo() {
  return (
    <MapDemoShell
      title="Trick or Treat"
      map={
        <MapCanvas
          style={GHOSTS_MAP_STYLE}
          {...GHOSTS_VIEWPORT}
          cooperativeGestures={false}
          lightPreset="night"
        >
          {({ map, isLoaded }) => (
            <GhostsMapEffects map={map} isLoaded={isLoaded} />
          )}
        </MapCanvas>
      }
    />
  );
}
