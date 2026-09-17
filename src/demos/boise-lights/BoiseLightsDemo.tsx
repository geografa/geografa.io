import type { Map } from "mapbox-gl";
import { MapCanvas, MapDemoShell } from "@/components/map";
import {
  BOISE_LIGHTS_MAP_STYLE,
  BOISE_LIGHTS_MAX_ZOOM,
  BOISE_LIGHTS_MIN_ZOOM,
  BOISE_LIGHTS_VIEWPORT,
} from "./types";
import { useBoiseLights } from "./useBoiseLights";

function BoiseLightsMapEffects({
  map,
  isLoaded,
}: {
  map: Map;
  isLoaded: boolean;
}) {
  useBoiseLights(map, isLoaded);
  return null;
}

export function BoiseLightsDemo() {
  return (
    <MapDemoShell
      title="Boise Lights"
      map={
        <MapCanvas
          style={BOISE_LIGHTS_MAP_STYLE}
          {...BOISE_LIGHTS_VIEWPORT}
          minZoom={BOISE_LIGHTS_MIN_ZOOM}
          maxZoom={BOISE_LIGHTS_MAX_ZOOM}
          lightPreset="night"
          hash
          cooperativeGestures={false}
        >
          {({ map, isLoaded }) => (
            <BoiseLightsMapEffects map={map} isLoaded={isLoaded} />
          )}
        </MapCanvas>
      }
    />
  );
}
