"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import BoundaryPanel from "@/components/BoundaryPanel";
import Topbar from "@/components/Topbar";
import { colorForIndex } from "@/lib/colors";
import { computeStats } from "@/lib/geo";
import type { GeocodeResult, LonLat, Parcel } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
      Memuat peta...
    </div>
  ),
});

export default function Home() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [geoMap, setGeoMap] = useState<Record<string, GeocodeResult | null>>({});
  const parcelSeq = useRef(0);
  const fetchingIds = useRef<Set<string>>(new Set());

  function handleAdd(ring: LonLat[]) {
    const index = parcelSeq.current;
    parcelSeq.current += 1;
    const parcel: Parcel = {
      id: `parcel-${index}-${Date.now()}`,
      ring,
      stats: computeStats(ring),
      label: `Bidang ${index + 1}`,
      color: colorForIndex(index),
    };
    setParcels((prev) => [...prev, parcel]);
  }

  function handleRemove(id: string) {
    setParcels((prev) => prev.filter((p) => p.id !== id));
    setGeoMap((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    fetchingIds.current.delete(id);
  }

  function handleClear() {
    setParcels([]);
    setGeoMap({});
    fetchingIds.current.clear();
  }

  useEffect(() => {
    parcels.forEach((parcel) => {
      if (parcel.id in geoMap || fetchingIds.current.has(parcel.id)) return;
      fetchingIds.current.add(parcel.id);
      const [lon, lat] = parcel.stats.centroid;

      fetch(`/api/geocode?lat=${lat}&lon=${lon}`)
        .then((r) => r.json())
        .then((data) => setGeoMap((prev) => ({ ...prev, [parcel.id]: data })))
        .catch(() => setGeoMap((prev) => ({ ...prev, [parcel.id]: null })))
        .finally(() => fetchingIds.current.delete(parcel.id));
    });
  }, [parcels, geoMap]);

  return (
    <div className="flex h-dvh w-full flex-col gap-3 bg-neutral-100 p-3 sm:gap-4 sm:p-4">
      <Topbar onAdd={handleAdd} />

      <main className="relative min-h-0 flex-1">
        <div className="absolute inset-0 overflow-hidden rounded-3xl shadow-sm ring-1 ring-black/5">
          <MapView parcels={parcels} />
        </div>
        <BoundaryPanel
          parcels={parcels}
          geoMap={geoMap}
          onRemove={handleRemove}
          onClear={handleClear}
        />
      </main>
    </div>
  );
}
