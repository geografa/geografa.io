import type { HexVotesControls } from "./useHexVotes";
import {
  REGION_OPTIONS,
  TEAM_BLUE,
  TEAM_RED,
  teamLabel,
  type ClaimedTeam,
  type HexRegion,
} from "./types";

export function HexVotesPanel({ controls }: { controls: HexVotesControls }) {
  const {
    region,
    resolution,
    nextTeam,
    loading,
    error,
    winner,
    setRegion,
    setResolution,
    setNextTeam,
    playAgain,
    dismissWinner,
  } = controls;

  const isBlueTurn = nextTeam === TEAM_BLUE;

  return (
    <>
      <aside className="hexvotes-panel" aria-label="HexVotes controls">
        <div className="hexvotes-panel__row">
          <label className="hexvotes-switch">
            <input
              type="checkbox"
              checked={isBlueTurn}
              onChange={(event) => {
                setNextTeam(event.target.checked ? TEAM_BLUE : TEAM_RED);
              }}
              aria-label="Toggle next team"
            />
            <span className="hexvotes-switch__slider" />
          </label>
          <span className="hexvotes-panel__label">
            Turn · {teamLabel(nextTeam as ClaimedTeam)}
          </span>
        </div>

        <div className="hexvotes-panel__row">
          <label className="hexvotes-panel__label" htmlFor="hexvotes-region">
            Region
          </label>
          <select
            id="hexvotes-region"
            value={region}
            onChange={(event) => setRegion(event.target.value as HexRegion)}
            disabled={loading}
          >
            {REGION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="hexvotes-panel__row">
          <label className="hexvotes-panel__label" htmlFor="hexvotes-resolution">
            Resolution
          </label>
          <input
            id="hexvotes-resolution"
            type="range"
            min={1}
            max={3}
            step={1}
            value={resolution}
            disabled={loading}
            onChange={(event) => setResolution(Number(event.target.value))}
          />
          <span className="hexvotes-panel__value">{resolution}</span>
        </div>

        <div className="hexvotes-panel__row">
          <button
            type="button"
            className="hexvotes-panel__button"
            onClick={playAgain}
            disabled={loading}
          >
            Play Again
          </button>
        </div>

        {loading ? (
          <p className="hexvotes-panel__status">Building hex grid…</p>
        ) : null}
        {error ? <p className="hexvotes-panel__error">{error}</p> : null}
        <p className="hexvotes-panel__hint">
          Click gray hexes to claim. Enclose rivals to capture. Longest path wins.
        </p>
      </aside>

      {winner ? (
        <div
          className="hexvotes-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hexvotes-winner-title"
          onClick={dismissWinner}
        >
          <div
            className="hexvotes-modal__content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="hexvotes-modal__close"
              aria-label="Close"
              onClick={dismissWinner}
            >
              ×
            </button>
            <h2 id="hexvotes-winner-title">{teamLabel(winner.team)} wins!</h2>
            <p>
              Longest contiguous connection: {winner.pathLength} hex
              {winner.pathLength === 1 ? "" : "es"} — {teamLabel(winner.team)}{" "}
              wins by longest path.
            </p>
            <button
              type="button"
              className="hexvotes-panel__button"
              onClick={() => {
                dismissWinner();
                playAgain();
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
