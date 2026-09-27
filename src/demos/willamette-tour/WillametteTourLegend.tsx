import { BATHYMETRY_LEGEND_STOPS } from "./types";

export function WillametteTourLegend() {
  const gradient = [...BATHYMETRY_LEGEND_STOPS]
    .reverse()
    .map((stop) => stop.color)
    .join(", ");

  return (
    <aside className="willamette-tour-legend" aria-label="Bathymetry legend">
      <h2 className="willamette-tour-legend__title">Depth</h2>
      <p className="willamette-tour-legend__subtitle">
        River bathymetry (feet below surface)
      </p>

      <div className="willamette-tour-legend__scale">
        <div
          className="willamette-tour-legend__ramp"
          style={{ background: `linear-gradient(to bottom, ${gradient})` }}
          aria-hidden
        />
        <ul className="willamette-tour-legend__labels">
          {[...BATHYMETRY_LEGEND_STOPS].reverse().map((stop) => (
            <li key={stop.value}>{stop.label}</li>
          ))}
        </ul>
      </div>
      <p className="willamette-tour-legend__hint">
        Hover the river for Lower / Upper depth band values.
      </p>
      <p className="willamette-tour-legend__source">
        Source:{" "}
        <a
          href="https://gis-pdx.opendata.arcgis.com/search?q=River%20Bathymetry"
          target="_blank"
          rel="noreferrer"
        >
          City of Portland Open Data, 2001
        </a>
      </p>
    </aside>
  );
}
