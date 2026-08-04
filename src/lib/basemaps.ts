export type BasemapId = "satelit" | "hybrid" | "osm" | "topo" | "light" | "dark";

export interface BasemapOverlay {
  url: string;
  attribution: string;
}

export interface Basemap {
  id: BasemapId;
  name: string;
  url: string;
  attribution: string;
  overlays?: BasemapOverlay[];
}

export const BASEMAPS: Basemap[] = [
  {
    id: "satelit",
    name: "Satelit",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "ViewMaps",
  },
  {
    id: "hybrid",
    name: "Hybrid",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "ViewMaps",
    overlays: [
      {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
        attribution: "ViewMaps",
      },
      {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        attribution: "ViewMaps",
      },
    ],
  },
  {
    id: "osm",
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "ViewMaps",
  },
  {
    id: "topo",
    name: "Topografi",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "ViewMaps",
  },
  {
    id: "light",
    name: "Terang",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "ViewMaps",
  },
  {
    id: "dark",
    name: "Gelap",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "ViewMaps",
  },
];
