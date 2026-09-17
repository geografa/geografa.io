import type { DemoViewport } from "@/lib/map";

export const TREE_SOURCE_ID = "tree-source";
export const TREE_LAYER_ID = "trees";
export const TREE_SOURCE_LAYER = "Street_Trees-7ger91";
export const TREE_TILESET_URL = "mapbox://grafa.czics6j7";

export const CONIFER_MODEL_ID = "model-conifer";
export const DECIDUOUS_MODEL_ID = "model-deciduous";

export const CONIFER_MODEL_URI = "/demos/portland-trees/models/pl-tree-conifer.glb";
export const DECIDUOUS_MODEL_URI =
  "/demos/portland-trees/models/pl-tree-deciduous.glb";

export const TREES_VIEWPORT: DemoViewport = {
  center: [-122.63581085028551, 45.52508375963012],
  zoom: 18.7,
  bearing: -24,
  pitch: 60.7,
};

export const TREES_INTRO_CAMERA = {
  center: [-122.67809578098382, 45.52366767466373] as [number, number],
  zoom: 16.78824324735485,
  bearing: -153.7804270109654,
  pitch: 73.99999999999997,
  duration: 15000,
};
