/** Undo document-level side effects Mapbox GL may leave after unmount. */
export function resetPageAfterMap(): void {
  document.body.style.removeProperty("overflow");
  document.body.style.removeProperty("height");
  document.body.style.removeProperty("width");
  document.body.style.removeProperty("position");
  document.documentElement.style.removeProperty("overflow");
  document.documentElement.style.removeProperty("height");

  document.body.classList.remove("mapboxgl-scrollable-page");
  document.documentElement.classList.remove("mapboxgl-scrollable-page");

  const root = document.getElementById("root");
  if (root) {
    root.style.removeProperty("height");
    root.style.removeProperty("overflow");
  }

  document
    .querySelectorAll(
      [
        ".mapboxgl-scroll-zoom-blocker",
        ".mapboxgl-touch-pan-blocker",
        ".mapboxgl-cooperative-gesture-screen",
      ].join(", "),
    )
    .forEach((node) => node.remove());

  // Remove orphaned map instances Mapbox may leave outside #root.
  document.querySelectorAll(".mapboxgl-map").forEach((node) => {
    if (!root?.contains(node)) {
      node.remove();
    }
  });

  document.querySelectorAll("canvas.mapboxgl-canvas").forEach((node) => {
    if (!root?.contains(node)) {
      node.remove();
    }
  });
}

/** Run after React effect cleanups (e.g. map.remove) on route changes. */
export function resetPageAfterMapDeferred(): void {
  requestAnimationFrame(() => {
    resetPageAfterMap();
    requestAnimationFrame(resetPageAfterMap);
  });
}
