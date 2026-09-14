import { useMemo, useRef, type ChangeEvent } from "react";
import {
  MapSidebar,
  MapSidebarSection,
  MapSlider,
  MapToggle,
} from "@/components/map";
import type { useModelMapper } from "./useModelMapper";

type Mapper = ReturnType<typeof useModelMapper>;

function rgbaToHex(rgba: string): string {
  const match = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return "#000000";
  const [, r, g, b] = match;
  return (
    "#" +
    [r, g, b]
      .map((v) => Number(v).toString(16).padStart(2, "0"))
      .join("")
  );
}

function hexToRgba(hex: string, alpha = 1): string {
  const cleaned = hex.replace("#", "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface ModelMapperPanelProps {
  mapper: Mapper;
}

export function ModelMapperPanel({ mapper }: ModelMapperPanelProps) {
  const { state, update, dismissIntro, replaceModelFile, copyProps, coordsLabel } =
    mapper;
  const colorHex = useMemo(() => rgbaToHex(state.color), [state.color]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    replaceModelFile(file);
  };

  return (
    <>
      {state.showIntro ? (
        <div className="model-mapper-intro" role="dialog" aria-modal="true">
          <h2>Add a Model to the Map</h2>
          <p>1. The default van model loads at the starting coordinates.</p>
          <p>2. Double-click anywhere to reposition the model.</p>
          <p>3. Replace the model with a local .glb upload.</p>
          <p>4. Clip existing buildings with the draw polygon tool.</p>
          <p>5. Adjust the properties as needed.</p>
          <button type="button" onClick={dismissIntro}>
            Get Started
          </button>
        </div>
      ) : (
        <MapSidebar
          title="Model Mapper"
          onCopy={state.modelPlaced ? copyProps : undefined}
        >
          <MapToggle
            id="dayPreset"
            label="Day light preset"
            checked={state.dayPreset}
            onChange={(dayPreset) => update({ dayPreset })}
          />

          <MapSidebarSection title="Model" />
          <div className="model-mapper-replace">
            <p className="model-mapper-replace__label">{state.modelLabel}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb,model/gltf-binary"
              className="model-mapper-replace__input"
              aria-label="Upload GLB model"
              onChange={onFileChange}
            />
            <button
              type="button"
              className="model-mapper-replace__button"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace Model
            </button>
          </div>

          <MapSidebarSection title="Coordinates" />
          <pre className="model-mapper-copy-box">{coordsLabel}</pre>

          <MapSlider
            id="model-rotate"
            label="Rotate"
            min={0}
            max={360}
            value={state.rotation}
            onChange={(rotation) => update({ rotation })}
          />
          <MapSlider
            id="model-scale"
            label="Scale"
            min={1}
            max={10}
            step={0.1}
            value={state.scale}
            onChange={(scale) => update({ scale })}
          />
          <MapSlider
            id="model-intensity"
            label="Color intensity"
            min={0}
            max={1}
            step={0.1}
            value={state.colorMixIntensity}
            onChange={(colorMixIntensity) => update({ colorMixIntensity })}
          />
          <MapSlider
            id="model-opacity"
            label="Opacity"
            min={0}
            max={1}
            step={0.1}
            value={state.opacity}
            onChange={(opacity) => update({ opacity })}
          />

          <MapSidebarSection title="Color" />
          <div className="model-mapper-color">
            <input
              type="color"
              className="model-mapper-color__swatch"
              value={colorHex}
              aria-label="Model color"
              onChange={(e) => update({ color: hexToRgba(e.target.value, 1) })}
            />
            <input
              type="text"
              className="model-mapper-copy-box model-mapper-color__text"
              value={state.color}
              aria-label="Model color RGBA"
              onChange={(e) => update({ color: e.target.value })}
            />
          </div>

          {state.modelPlaced ? (
            <>
              <MapSidebarSection title="Model properties" />
              <pre className="model-mapper-copy-box model-mapper-props">
                {JSON.stringify(copyProps() ?? {}, null, 2)}
              </pre>
            </>
          ) : null}
        </MapSidebar>
      )}
    </>
  );
}
