import type { WillametteStop } from "./types";

interface WillametteTourNavProps {
  stops: WillametteStop[];
  activeId: string;
  onSelect: (stop: WillametteStop) => void;
}

export function WillametteTourNav({
  stops,
  activeId,
  onSelect,
}: WillametteTourNavProps) {
  return (
    <nav
      className="willamette-tour-nav"
      aria-label="Willamette river bathymetry stops"
    >
      <ol className="willamette-tour-nav__track">
        {stops.map((stop) => {
          const isActive = stop.id === activeId;
          return (
            <li key={stop.id} className="willamette-tour-nav__stop">
              <button
                type="button"
                className={
                  isActive
                    ? "willamette-tour-nav__button willamette-tour-nav__button--active"
                    : "willamette-tour-nav__button"
                }
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelect(stop)}
              >
                <span className="willamette-tour-nav__dot" aria-hidden />
                <span className="willamette-tour-nav__label">{stop.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
