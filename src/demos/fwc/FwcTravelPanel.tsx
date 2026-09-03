import { useState } from "react";
import type { DistanceKey, FwcDetails } from "./types";

const ROW_ICONS: Record<DistanceKey, string> = {
  stadium: "/demos/fwc/img/sq-stadium.svg",
  airport: "/demos/fwc/img/sq-airport.svg",
  basecamp: "/demos/fwc/img/sq-soccer.svg",
  hotel: "/demos/fwc/img/sq-hotel.svg",
};

const ROW_ORDER: DistanceKey[] = [
  "stadium",
  "airport",
  "basecamp",
  "hotel",
];

interface FwcTravelPanelProps {
  details: FwcDetails;
  geocoderRef: React.RefObject<HTMLDivElement | null>;
}

export function FwcTravelPanel({ details, geocoderRef }: FwcTravelPanelProps) {
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <aside className={`fwc-panel ${panelOpen ? "fwc-panel--open" : "fwc-panel--collapsed"}`}>
      <div className="fwc-panel__heading">
        <h2>Travel Times</h2>
        <p>Host stadiums, basecamps, hotels, and airports.</p>
        <div className="fwc-panel__icons">
          <img src="/demos/fwc/img/sq-stadium.svg" alt="Stadium" />
          <img src="/demos/fwc/img/sq-soccer.svg" alt="Basecamp" />
          <img src="/demos/fwc/img/sq-hotel.svg" alt="Hotel" />
          <img src="/demos/fwc/img/sq-airport.svg" alt="Airport" />
        </div>
      </div>

      <div ref={geocoderRef} className="fwc-panel__geocoder" />

      {panelOpen ? (
        <div className="fwc-panel__details">
          {details.name ? (
            <>
              <h3>{details.name}</h3>
              {details.city ? <p>{details.city}</p> : null}
            </>
          ) : null}

          {ROW_ORDER.map((key) => {
            const row = details.rows[key];
            if (!row) return null;
            return (
              <p key={key} className="fwc-panel__distance">
                <img src={ROW_ICONS[key]} alt="" />
                {row.name}: {row.minutes} min / {row.miles} mi
              </p>
            );
          })}
        </div>
      ) : null}

      <button
        type="button"
        className="fwc-panel__toggle"
        onClick={() => setPanelOpen((open) => !open)}
        aria-label={panelOpen ? "Collapse panel" : "Expand panel"}
      >
        <img
          src={panelOpen ? "/demos/fwc/img/close.svg" : "/demos/fwc/img/open.svg"}
          alt=""
        />
      </button>
    </aside>
  );
}
