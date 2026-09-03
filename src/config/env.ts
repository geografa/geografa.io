export function getMapboxToken(): string {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "Missing VITE_MAPBOX_ACCESS_TOKEN. Copy .env.example to .env.local and add your Mapbox token.",
    );
  }
  return token;
}
