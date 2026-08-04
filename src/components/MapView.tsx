"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Polygon, TileLayer, ZoomControl, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import LayerSwitcher from "./LayerSwitcher";
import { BASEMAPS, type BasemapId } from "@/lib/basemaps";
import type { LonLat } from "@/lib/types";

const INDONESIA_CENTER: LatLngExpression = [-2.5, 118];

function FitToRing({ positions }: { positions: LatLngExpression[] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;
    const bounds = positions.map((p) => p as [number, number]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 18 });
  }, [positions, map]);

  return null;
}

export default function MapView({ ring }: { ring: LonLat[] | null }) {
  const [basemapId, setBasemapId] = useState<BasemapId>("satelit");
  const basemap = BASEMAPS.find((b) => b.id === basemapId) ?? BASEMAPS[0];

  const positions: LatLngExpression[] = (ring ?? []).map(([lon, lat]) => [lat, lon]);
  const centroidPos: LatLngExpression | null =
    positions.length > 0
      ? [
          positions.reduce((s, p) => s + (p as [number, number])[0], 0) / positions.length,
          positions.reduce((s, p) => s + (p as [number, number])[1], 0) / positions.length,
        ]
      : null;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={INDONESIA_CENTER}
        zoom={5}
        className="h-full w-full"
        scrollWheelZoom
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />

        <TileLayer key={basemap.id} url={basemap.url} attribution={basemap.attribution} maxZoom={20} />
        {basemap.overlays?.map((overlay) => (
          <TileLayer
            key={`${basemap.id}-${overlay.url}`}
            url={overlay.url}
            attribution={overlay.attribution}
            maxZoom={20}
          />
        ))}

        {positions.length > 0 && (
          <>
            <Polygon
              positions={positions}
              pathOptions={{ color: "#f59e0b", weight: 3, fillColor: "#f59e0b", fillOpacity: 0.22 }}
            />
            {centroidPos && (
              <CircleMarker
                center={centroidPos}
                radius={5}
                pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#f97316", fillOpacity: 1 }}
              />
            )}
            <FitToRing positions={positions} />
          </>
        )}
      </MapContainer>

      <LayerSwitcher active={basemapId} onChange={setBasemapId} />
    </div>
  );
}
