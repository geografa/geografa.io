import type { Map } from "mapbox-gl";

const DEFAULT_ICON_SIZE = 64;

/** Rasterize an SVG (or other browser-decodable image) for Mapbox symbol layers. */
export async function addMapImageFromUrl(
  map: Map,
  id: string,
  url: string,
  pixelSize = DEFAULT_ICON_SIZE,
): Promise<void> {
  if (map.hasImage(id)) return;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch map image: ${url}`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to decode map image: ${url}`));
      img.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = pixelSize;
    canvas.height = pixelSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D context unavailable");
    }

    ctx.drawImage(image, 0, 0, pixelSize, pixelSize);
    const { data, width, height } = ctx.getImageData(0, 0, pixelSize, pixelSize);

    map.addImage(id, { width, height, data });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function addMapImagesFromUrls(
  map: Map,
  images: ReadonlyArray<{ id: string; url: string }>,
  pixelSize = DEFAULT_ICON_SIZE,
): Promise<void> {
  await Promise.all(
    images.map(({ id, url }) => addMapImageFromUrl(map, id, url, pixelSize)),
  );
}
