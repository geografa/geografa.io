import type { TrailsControls } from "./useWashingtonParkTrails";

export function TrailsPanel({ controls }: { controls: TrailsControls }) {
  const {
    trailNames,
    selectedTrail,
    panelOpen,
    loading,
    error,
    selectTrail,
    clearSelection,
    setPanelOpen,
  } = controls;

  if (!panelOpen) {
    return (
      <button
        type="button"
        className="trails-panel__reopen"
        onClick={() => setPanelOpen(true)}
      >
        Trails list
      </button>
    );
  }

  return (
    <aside className="trails-panel" aria-label="Washington Park trails">
      <div className="trails-panel__header">
        <div>
          <h2>Trails of Washington Park</h2>
          <p>Portland, Oregon</p>
        </div>
        <button
          type="button"
          className="trails-panel__close"
          onClick={() => setPanelOpen(false)}
          aria-label="Close trails list"
        >
          ×
        </button>
      </div>

      {loading ? <p className="trails-panel__status">Loading trails…</p> : null}
      {error ? <p className="trails-panel__status trails-panel__status--error">{error}</p> : null}

      {!loading && !error ? (
        <>
          <button
            type="button"
            className={`trails-panel__item trails-panel__item--all${
              selectedTrail === null ? " is-active" : ""
            }`}
            onClick={clearSelection}
          >
            Show all trails
          </button>
          <ul className="trails-panel__list">
            {trailNames.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  className={`trails-panel__item${
                    selectedTrail === name ? " is-active" : ""
                  }`}
                  onClick={() => selectTrail(name)}
                >
                  <span className="trails-panel__dot" aria-hidden />
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </aside>
  );
}
