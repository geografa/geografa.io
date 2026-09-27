import { useEffect } from "react";
import mapboxgl, { type Map, type MapLayerMouseEvent } from "mapbox-gl";
import { BATHYMETRY_LAYER_ID } from "./types";

function formatDepth(value: unknown): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `${Math.abs(n)} ft`;
}

export function useWillametteBathymetry(map: Map | null, isLoaded: boolean) {
  useEffect(() => {
    if (!map || !isLoaded) return;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 14,
      className: "willamette-tour-tooltip",
      maxWidth: "240px",
    });

    const onMove = (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature?.properties) {
        popup.remove();
        return;
      }

      map.getCanvas().style.cursor = "pointer";
      const { LOWER_, UPPER_ } = feature.properties;
      popup
        .setLngLat(event.lngLat)
        .setHTML(
          `<div class="willamette-tour-tooltip__body">
            <p class="willamette-tour-tooltip__title">Bathymetry</p>
            <dl>
              <div><dt>Lower</dt><dd>${formatDepth(LOWER_)}</dd></div>
              <div><dt>Upper</dt><dd>${formatDepth(UPPER_)}</dd></div>
            </dl>
          </div>`,
        )
        .addTo(map);
    };

    const onLeave = () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    };

    map.on("mousemove", BATHYMETRY_LAYER_ID, onMove);
    map.on("mouseleave", BATHYMETRY_LAYER_ID, onLeave);

    return () => {
      map.off("mousemove", BATHYMETRY_LAYER_ID, onMove);
      map.off("mouseleave", BATHYMETRY_LAYER_ID, onLeave);
      map.getCanvas().style.cursor = "";
      popup.remove();
    };
  }, [map, isLoaded]);
}
