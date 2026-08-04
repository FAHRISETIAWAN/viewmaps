export type LonLat = [number, number];

export type CoordOrder = "lonlat" | "latlon";

export interface BoundaryStats {
  areaM2: number;
  areaHa: number;
  perimeterM: number;
  centroid: LonLat;
  bbox: [number, number, number, number];
  vertexCount: number;
}

export interface BoundaryData {
  ring: LonLat[];
  stats: BoundaryStats;
}

export interface GeocodeResult {
  displayName: string;
  village?: string;
  district?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
}
