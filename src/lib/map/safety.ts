import type { Map } from "mapbox-gl";

const detachedMaps = new WeakSet<Map>();

/**
 * Mapbox throws on nearly every method once `remove()` has run. React tears
 * down parent effects before child effects, so a demo's layer cleanup can run
 * against an already-destroyed map. Marking the instance lets those cleanups
 * bail out instead of throwing during the commit phase.
 */
export function markMapDetached(map: Map): void {
  detachedMaps.add(map);
}

export function isMapUsable(map: Map | null | undefined): map is Map {
  if (!map || detachedMaps.has(map)) return false;
  try {
    return typeof map.getStyle === "function" && Boolean(map.getStyle());
  } catch {
    return false;
  }
}

/** Run a map operation, swallowing errors from a torn-down instance. */
export function withMap(map: Map | null | undefined, fn: (map: Map) => void): void {
  if (!isMapUsable(map)) return;
  try {
    fn(map);
  } catch {
    // instance was destroyed mid-teardown
  }
}
