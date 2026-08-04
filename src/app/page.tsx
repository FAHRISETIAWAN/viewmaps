"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import BoundaryPanel from "@/components/BoundaryPanel";
import Topbar from "@/components/Topbar";
import { computeStats } from "@/lib/geo";
import type { BoundaryStats, GeocodeResult, LonLat } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
      Memuat peta...
    </div>
  ),
});

export default function Home() {
  const [ring, setRing] = useState<LonLat[] | null>(null);
  const [geoState, setGeoState] = useState<{
    key: BoundaryStats | null;
    data: GeocodeResult | null;
  }>({ key: null, data: null });

  const stats = useMemo(() => (ring ? computeStats(ring) : null), [ring]);

  useEffect(() => {
    if (!stats) return;
    const [lon, lat] = stats.centroid;
    let cancelled = false;

    fetch(`/api/geocode?lat=${lat}&lon=${lon}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setGeoState({ key: stats, data });
      })
      .catch(() => {
        if (!cancelled) setGeoState({ key: stats, data: null });
      });

    return () => {
      cancelled = true;
    };
  }, [stats]);

  const effectiveGeo = geoState.key === stats ? geoState.data : null;
  const effectiveGeoLoading = !!stats && geoState.key !== stats;

  return (
    <div className="flex h-dvh w-full flex-col gap-3 bg-neutral-100 p-3 sm:gap-4 sm:p-4">
      <Topbar onResult={setRing} />

      <main className="relative min-h-0 flex-1">
        <div className="absolute inset-0 overflow-hidden rounded-3xl shadow-sm ring-1 ring-black/5">
          <MapView ring={ring} />
        </div>
        <BoundaryPanel stats={stats} geo={effectiveGeo} geoLoading={effectiveGeoLoading} />
      </main>
    </div>
  );
}
