import { MapCanvas, MapDemoShell } from "@/components/map";
import { STRAVA_MAP_STYLE, STRAVA_VIEWPORT } from "./types";

export function WillamettePaddlesDemo() {
  return (
    <MapDemoShell
      title="Willamette Paddles"
      map={
        <MapCanvas
          style={STRAVA_MAP_STYLE}
          {...STRAVA_VIEWPORT}
          hash
          cooperativeGestures={false}
          lightPreset="night"
        />
      }
    />
  );
}
