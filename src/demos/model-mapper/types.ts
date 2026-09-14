import type { DemoViewport } from "@/lib/map";

export const MODEL_SOURCE_ID = "custom-model";
export const MODEL_LAYER_ID = "custom-model";
export const ERASER_SOURCE_ID = "eraser";
export const ERASER_LINE_LAYER_ID = "eraser-line";
export const ERASER_CLIP_LAYER_ID = "eraser";

export const DEFAULT_MODEL_URI = "/demos/model-mapper/models/van.glb";
export const DEFAULT_MODEL_LABEL = "van.glb";

export const MODEL_MAPPER_VIEWPORT: DemoViewport = {
  center: [-77.036679, 38.896945],
  zoom: 17,
  bearing: -24,
  pitch: 56,
};

export const INITIAL_MODEL_COORDINATES: [number, number] = [
  -77.036679, 38.896945,
];

export interface ModelMapperState {
  modelUri: string;
  modelLabel: string;
  coordinates: [number, number];
  rotation: number;
  scale: number;
  colorMixIntensity: number;
  opacity: number;
  color: string;
  dayPreset: boolean;
  modelPlaced: boolean;
  showIntro: boolean;
}

export const initialModelMapperState: ModelMapperState = {
  modelUri: DEFAULT_MODEL_URI,
  modelLabel: DEFAULT_MODEL_LABEL,
  coordinates: INITIAL_MODEL_COORDINATES,
  rotation: 0,
  scale: 1,
  colorMixIntensity: 0,
  opacity: 1,
  color: "rgba(0, 0, 0, 1)",
  dayPreset: true,
  modelPlaced: false,
  showIntro: true,
};

export function formatCoords(coords: [number, number]): string {
  return `${coords[0].toFixed(8)}, ${coords[1].toFixed(8)}`;
}

export function paintPropsFromState(state: ModelMapperState) {
  return {
    "model-color-mix-intensity": state.colorMixIntensity,
    "model-color": state.color,
    "model-scale": [state.scale, state.scale, state.scale],
    "model-rotation": [0, 0, state.rotation],
    "model-opacity": state.opacity,
    "model-emissive-strength": 1,
  };
}

export function isGlbFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith(".glb") || file.type === "model/gltf-binary";
}
