"use client";

import "leaflet/dist/leaflet.css";
import { Fragment, useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Polygon, TileLayer, ZoomControl, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import LayerSwitcher from "./LayerSwitcher";
import { BASEMAPS, type BasemapId } from "@/lib/basemaps";
import type { Parcel } from "@/lib/types";

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

export default function MapView({ parcels }: { parcels: Parcel[] }) {
  const [basemapId, setBasemapId] = useState<BasemapId>("satelit");
  const basemap = BASEMAPS.find((b) => b.id === basemapId) ?? BASEMAPS[0];

  const allPositions = useMemo<LatLngExpression[]>(
    () => parcels.flatMap((p) => p.ring.map(([lon, lat]) => [lat, lon] as LatLngExpression)),
    [parcels]
  );

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

        {parcels.map((parcel) => {
          const positions: LatLngExpression[] = parcel.ring.map(([lon, lat]) => [lat, lon]);
          const [cLon, cLat] = parcel.stats.centroid;
          return (
            <Fragment key={parcel.id}>
              <Polygon
                positions={positions}
                pathOptions={{
                  color: parcel.color,
                  weight: 3,
                  fillColor: parcel.color,
                  fillOpacity: 0.22,
                }}
              />
              <CircleMarker
                center={[cLat, cLon]}
                radius={5}
                pathOptions={{ color: "#ffffff", weight: 2, fillColor: parcel.color, fillOpacity: 1 }}
              />
            </Fragment>
          );
        })}

        {allPositions.length > 0 && <FitToRing positions={allPositions} />}
      </MapContainer>

      <LayerSwitcher active={basemapId} onChange={setBasemapId} />
    </div>
  );
}
