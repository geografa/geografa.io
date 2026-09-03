import { useEffect, useState } from "react";
import type { Map } from "mapbox-gl";
import {
  MapAttribution,
  MapCanvas,
  MapDemoShell,
  MapSidebar,
  MapSidebarSection,
  MapSlider,
  MapToggle,
} from "@/components/map";
import { DEFAULT_MAP_OPTIONS, vegasLineDesignerViewport } from "@/lib/map";
import { useSimpleLineDesigner } from "./useSimpleLineDesigner";

function MapContextSync({
  map,
  isLoaded,
  onReady,
}: {
  map: Map;
  isLoaded: boolean;
  onReady: (ctx: { map: Map; isLoaded: boolean }) => void;
}) {
  useEffect(() => {
    onReady({ map, isLoaded });
  }, [map, isLoaded, onReady]);

  return null;
}

function LineDesignerSidebar({
  map,
  isLoaded,
}: {
  map: Map;
  isLoaded: boolean;
}) {
  const { state, update, copyProps } = useSimpleLineDesigner(map, isLoaded);

  return (
    <MapSidebar title="Copy properties" onCopy={copyProps}>
      <MapSlider
        id="lineWidth"
        label="line-width"
        min={0}
        max={20}
        value={state.lineWidth}
        onChange={(lineWidth) => update({ lineWidth })}
      />
      <MapSlider
        id="lineBlur"
        label="line-blur"
        min={0}
        max={10}
        value={state.lineBlur}
        onChange={(lineBlur) => update({ lineBlur })}
      />
      <MapSlider
        id="lineOpacity"
        label="line-opacity"
        min={0}
        max={1}
        step={0.05}
        value={state.lineOpacity}
        onChange={(lineOpacity) => update({ lineOpacity })}
      />
      <MapSlider
        id="lineEmissiveStrength"
        label="line-emissive-strength"
        min={0}
        max={1}
        step={0.1}
        value={state.lineEmissiveStrength}
        onChange={(lineEmissiveStrength) => update({ lineEmissiveStrength })}
      />
      <MapSlider
        id="lineZOffset"
        label="line-z-offset"
        min={0}
        max={50}
        value={state.lineZOffset}
        onChange={(lineZOffset) => update({ lineZOffset })}
      />

      <MapSidebarSection title="Casing" />

      <MapSlider
        id="lineCasingWidth"
        label="line-width"
        min={1}
        max={20}
        value={state.casingWidth}
        onChange={(casingWidth) => update({ casingWidth })}
      />
      <MapSlider
        id="lineCasingBlur"
        label="line-blur"
        min={0}
        max={10}
        value={state.casingBlur}
        onChange={(casingBlur) => update({ casingBlur })}
      />
      <MapSlider
        id="lineCasingOpacity"
        label="line-opacity"
        min={0}
        max={1}
        step={0.1}
        value={state.casingOpacity}
        onChange={(casingOpacity) => update({ casingOpacity })}
      />
      <MapSlider
        id="lineCasingOffset"
        label="line-offset"
        min={-10}
        max={10}
        value={state.casingOffset}
        onChange={(casingOffset) => update({ casingOffset })}
      />

      <MapToggle
        id="casingVisible"
        label="Show casing"
        checked={state.casingVisible}
        onChange={(casingVisible) => update({ casingVisible })}
      />
      <MapToggle
        id="dayPreset"
        label="Day light preset"
        checked={state.dayPreset}
        onChange={(dayPreset) => update({ dayPreset })}
      />
    </MapSidebar>
  );
}

export function SimpleLineDesignerDemo() {
  const [mapCtx, setMapCtx] = useState<{
    map: Map;
    isLoaded: boolean;
  } | null>(null);

  return (
    <MapDemoShell
      title="Simple Line Designer"
      map={
        <MapCanvas {...DEFAULT_MAP_OPTIONS} {...vegasLineDesignerViewport}>
          {({ map, isLoaded }) => (
            <>
              <MapContextSync
                map={map}
                isLoaded={isLoaded}
                onReady={setMapCtx}
              />
              <MapAttribution map={map} />
            </>
          )}
        </MapCanvas>
      }
      sidebar={
        mapCtx?.isLoaded ? (
          <LineDesignerSidebar map={mapCtx.map} isLoaded={mapCtx.isLoaded} />
        ) : null
      }
    />
  );
}
