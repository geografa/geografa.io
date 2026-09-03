import { useEffect } from "react";
import type { ReactNode } from "react";
import mapboxgl, { type LngLatLike, type Map } from "mapbox-gl";

interface MapPopupProps {
  map: Map;
  lngLat: LngLatLike;
  children: ReactNode;
  onClose?: () => void;
}

export function MapPopup({ map, lngLat, children, onClose }: MapPopupProps) {
  useEffect(() => {
    const container = document.createElement("div");
    const root = document.createElement("div");
    container.appendChild(root);

    const popup = new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat(lngLat)
      .setDOMContent(container)
      .addTo(map);

    if (onClose) {
      popup.on("close", onClose);
    }

    return () => {
      popup.remove();
    };
  }, [map, lngLat, children, onClose]);

  return null;
}
