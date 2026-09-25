import type { Map } from "mapbox-gl";
import { MapCanvas, MapDemoShell } from "@/components/map";
import {
  WINTER_WONDERLAND_MAP_STYLE,
  WINTER_WONDERLAND_VIEWPORT,
} from "./types";
import { useWinterWonderlandTour } from "./useWinterWonderlandTour";

function WinterWonderlandMapEffects({
  map,
  isLoaded,
}: {
  map: Map;
  isLoaded: boolean;
}) {
  useWinterWonderlandTour(map, isLoaded);
  return null;
}

export function WinterWonderlandDemo() {
  return (
    <MapDemoShell
      title="Winter Wonderland"
      map={
        <MapCanvas
          style={WINTER_WONDERLAND_MAP_STYLE}
          {...WINTER_WONDERLAND_VIEWPORT}
          cooperativeGestures={false}
        >
          {({ map, isLoaded }) => (
            <WinterWonderlandMapEffects map={map} isLoaded={isLoaded} />
          )}
        </MapCanvas>
      }
    />
  );
}
