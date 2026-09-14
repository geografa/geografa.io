import { useEffect, useState } from "react";
import type { Map } from "mapbox-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { MapCanvas, MapDemoShell } from "@/components/map";
import { DEFAULT_MAP_OPTIONS } from "@/lib/map";
import { ModelMapperPanel } from "./ModelMapperPanel";
import { useModelMapper } from "./useModelMapper";
import { MODEL_MAPPER_VIEWPORT } from "./types";
import "@/styles/model-mapper.css";

type MapContext = { map: Map; isLoaded: boolean };

function MapContextSync({
  map,
  isLoaded,
  onReady,
}: {
  map: Map;
  isLoaded: boolean;
  onReady: (ctx: MapContext | null) => void;
}) {
  useEffect(() => {
    onReady({ map, isLoaded });
  }, [map, isLoaded, onReady]);

  useEffect(() => {
    return () => onReady(null);
  }, [onReady]);

  return null;
}

function ModelMapperContent({
  map,
  isLoaded,
  onIntroChange,
}: {
  map: Map;
  isLoaded: boolean;
  onIntroChange: (showIntro: boolean) => void;
}) {
  const mapper = useModelMapper(map, isLoaded);

  useEffect(() => {
    onIntroChange(mapper.state.showIntro);
  }, [mapper.state.showIntro, onIntroChange]);

  return <ModelMapperPanel mapper={mapper} />;
}

export function ModelMapperDemo() {
  const [mapCtx, setMapCtx] = useState<MapContext | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  return (
    <MapDemoShell
      title="Model Mapper"
      map={
        <div
          className={
            showIntro
              ? "model-mapper-map model-mapper-map--blurred"
              : "model-mapper-map"
          }
        >
          <MapCanvas
            {...DEFAULT_MAP_OPTIONS}
            {...MODEL_MAPPER_VIEWPORT}
            cooperativeGestures={false}
          >
            {({ map, isLoaded }) => (
              <MapContextSync
                map={map}
                isLoaded={isLoaded}
                onReady={setMapCtx}
              />
            )}
          </MapCanvas>
        </div>
      }
      sidebar={
        mapCtx ? (
          <ModelMapperContent
            map={mapCtx.map}
            isLoaded={mapCtx.isLoaded}
            onIntroChange={setShowIntro}
          />
        ) : null
      }
    />
  );
}
