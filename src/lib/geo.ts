import { area, bbox, centroid, length, lineString, polygon } from "@turf/turf";
import type { BoundaryStats, LonLat } from "./types";

export function computeStats(ring: LonLat[]): BoundaryStats {
  const poly = polygon([ring]);
  const line = lineString(ring);

  const areaM2 = area(poly);
  const perimeterM = length(line, { units: "kilometers" }) * 1000;
  const [cLon, cLat] = centroid(poly).geometry.coordinates;
  const [minX, minY, maxX, maxY] = bbox(poly);

  return {
    areaM2,
    areaHa: areaM2 / 10000,
    perimeterM,
    centroid: [cLon, cLat],
    bbox: [minX, minY, maxX, maxY],
    vertexCount: ring.length - 1,
  };
}
