import { gridDisk } from "h3-js";
import geojson2h3 from "geojson2h3";
import {
  TEAM_BLUE,
  TEAM_GRAY,
  TEAM_RED,
  type ClaimedTeam,
  type HexFeature,
  type HexFeatureCollection,
  type WinnerInfo,
} from "./types";

const emptyLongest: HexFeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

function seedTeams(features: HexFeature[]): void {
  const total = features.length;
  if (total === 0) return;

  for (let i = 0; i < 3; i++) {
    features[Math.floor(Math.random() * total)].properties.team = TEAM_RED;
  }
  for (let i = 0; i < 3; i++) {
    features[Math.floor(Math.random() * total)].properties.team = TEAM_BLUE;
  }
}

export function buildBoard(
  boundary: GeoJSON.FeatureCollection | GeoJSON.Feature,
  resolution: number,
): HexFeatureCollection {
  const hexagons = geojson2h3.featureToH3Set(boundary, resolution);
  const collection = geojson2h3.h3SetToFeatureCollection(hexagons, (h3Index) => ({
    votes: 0,
    team: TEAM_GRAY,
    hexID: h3Index,
  })) as HexFeatureCollection;

  collection.features.forEach((feature, index) => {
    feature.id = index;
    feature.properties.team = TEAM_GRAY;
  });

  seedTeams(collection.features);
  return collection;
}

/** Capture opponent hexes fully surrounded by 6 same-team neighbors (cascading). */
export function applyEnclosures(
  collection: HexFeatureCollection,
): HexFeatureCollection {
  const features = collection.features.map((feature) => ({
    ...feature,
    properties: { ...feature.properties },
  }));
  const featureByHex = new Map(
    features.map((feature) => [feature.properties.hexID, feature]),
  );

  let changed = true;
  let iterations = 0;
  const maxIterations = features.length;

  while (changed && iterations < maxIterations) {
    changed = false;
    iterations += 1;

    for (const feature of features) {
      const centerHex = feature.properties.hexID;
      const centerTeam = feature.properties.team;
      if (centerTeam === TEAM_GRAY) continue;

      const neighborHexes = gridDisk(centerHex, 1).filter((h) => h !== centerHex);
      if (neighborHexes.length !== 6) continue;

      const neighborTeams = neighborHexes.map((h) => {
        const neighbor = featureByHex.get(h);
        return neighbor ? neighbor.properties.team : null;
      });
      if (neighborTeams.includes(null)) continue;

      const firstTeam = neighborTeams[0];
      if (
        !firstTeam ||
        firstTeam === TEAM_GRAY ||
        centerTeam === firstTeam ||
        !neighborTeams.every((team) => team === firstTeam)
      ) {
        continue;
      }

      feature.properties.team = firstTeam;
      changed = true;
    }
  }

  return { type: "FeatureCollection", features };
}

export function claimHex(
  collection: HexFeatureCollection,
  featureId: number | string,
  team: ClaimedTeam,
): HexFeatureCollection {
  const features = collection.features.map((feature) => {
    if (feature.id !== featureId) return feature;
    return {
      ...feature,
      properties: { ...feature.properties, team },
    };
  });
  return applyEnclosures({ type: "FeatureCollection", features });
}

type PathResult = {
  path: string[];
  team: ClaimedTeam | null;
};

function longestContiguousPath(collection: HexFeatureCollection): PathResult {
  const features = collection.features;
  const featureByHex = new Map(
    features.map((feature) => [feature.properties.hexID, feature]),
  );
  const allHexes = features.map((feature) => feature.properties.hexID);

  const neighborMap = new Map<string, string[]>();
  for (const feature of features) {
    const hex = feature.properties.hexID;
    const team = feature.properties.team;
    const sameNeighbors = gridDisk(hex, 1)
      .filter((h) => h !== hex)
      .filter((neighbor) => {
        const neighborFeature = featureByHex.get(neighbor);
        return neighborFeature?.properties.team === team;
      });
    neighborMap.set(hex, sameNeighbors);
  }

  const visited = new Set<string>();
  const components: string[][] = [];
  for (const hex of allHexes) {
    if (visited.has(hex)) continue;
    const component: string[] = [];
    const stack = [hex];
    visited.add(hex);
    while (stack.length) {
      const current = stack.pop()!;
      component.push(current);
      for (const neighbor of neighborMap.get(current) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          stack.push(neighbor);
        }
      }
    }
    components.push(component);
  }

  function bfsFurthest(start: string, allowed: Set<string>) {
    const queue = [start];
    const parent = new Map<string, string | null>([[start, null]]);
    const dist = new Map<string, number>([[start, 0]]);
    let furthest = start;

    while (queue.length) {
      const current = queue.shift()!;
      const distance = dist.get(current) ?? 0;
      if (distance > (dist.get(furthest) ?? 0)) furthest = current;

      for (const neighbor of neighborMap.get(current) ?? []) {
        if (!allowed.has(neighbor) || parent.has(neighbor)) continue;
        parent.set(neighbor, current);
        dist.set(neighbor, distance + 1);
        queue.push(neighbor);
      }
    }

    return { furthest, parent };
  }

  let bestPath: string[] = [];
  for (const component of components) {
    if (component.length === 0) continue;
    const allowed = new Set(component);
    const first = bfsFurthest(component[0], allowed);
    const second = bfsFurthest(first.furthest, allowed);
    const path: string[] = [];
    let cursor: string | null = second.furthest;
    while (cursor !== null) {
      path.push(cursor);
      cursor = second.parent.get(cursor) ?? null;
    }
    path.reverse();
    if (path.length > bestPath.length) bestPath = path;
  }

  if (bestPath.length === 0) return { path: [], team: null };
  const team = featureByHex.get(bestPath[0])?.properties.team;
  if (team !== TEAM_RED && team !== TEAM_BLUE) {
    return { path: bestPath, team: null };
  }
  return { path: bestPath, team };
}

export function computeWinnerHighlight(collection: HexFeatureCollection): {
  longest: HexFeatureCollection;
  winner: WinnerInfo | null;
} {
  const hasGray = collection.features.some(
    (feature) => feature.properties.team === TEAM_GRAY,
  );
  if (hasGray) {
    return { longest: emptyLongest, winner: null };
  }

  const { path, team } = longestContiguousPath(collection);
  if (!team || path.length === 0) {
    return { longest: emptyLongest, winner: null };
  }

  const featureByHex = new Map(
    collection.features.map((feature) => [feature.properties.hexID, feature]),
  );

  const longest: HexFeatureCollection = {
    type: "FeatureCollection",
    features: path
      .map((hexID) => featureByHex.get(hexID))
      .filter((feature): feature is HexFeature => Boolean(feature))
      .map((feature) => ({
        type: "Feature",
        geometry: feature.geometry,
        properties: { ...feature.properties },
      })),
  };

  return {
    longest,
    winner: { team, pathLength: path.length },
  };
}

export { emptyLongest };
