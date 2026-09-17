import type { Map } from "mapbox-gl";
import { MapCanvas, MapDemoShell } from "@/components/map";
import { DEFAULT_MAP_OPTIONS } from "@/lib/map";
import { TREES_VIEWPORT } from "./types";
import { usePortlandTrees } from "./usePortlandTrees";

function TreesMapEffects({
  map,
  isLoaded,
}: {
  map: Map;
  isLoaded: boolean;
}) {
  usePortlandTrees(map, isLoaded);
  return null;
}

export function PortlandTreesDemo() {
  return (
    <MapDemoShell
      title="Portland Trees"
      map={
        <MapCanvas
          {...DEFAULT_MAP_OPTIONS}
          {...TREES_VIEWPORT}
          hash
          cooperativeGestures={false}
        >
          {({ map, isLoaded }) => (
            <TreesMapEffects map={map} isLoaded={isLoaded} />
          )}
        </MapCanvas>
      }
    />
  );
}
