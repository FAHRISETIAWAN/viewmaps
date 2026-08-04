"use client";

import type { BoundaryStats, GeocodeResult } from "@/lib/types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-sm">
      <span className="text-neutral-400">{label}</span>
      <span className="text-right font-medium text-neutral-800">{value}</span>
    </div>
  );
}

export function StatsDetail({ stats }: { stats: BoundaryStats }) {
  return (
    <div className="divide-y divide-neutral-100">
      <Row label="Luas" value={`${stats.areaHa.toFixed(4)} ha`} />
      <Row
        label="Luas (m²)"
        value={stats.areaM2.toLocaleString("id-ID", { maximumFractionDigits: 1 })}
      />
      <Row
        label="Keliling"
        value={`${stats.perimeterM.toLocaleString("id-ID", { maximumFractionDigits: 1 })} m`}
      />
      <Row label="Jumlah titik" value={`${stats.vertexCount}`} />
      <Row label="Centroid" value={`${stats.centroid[1].toFixed(6)}, ${stats.centroid[0].toFixed(6)}`} />
      <Row
        label="Bounding box"
        value={`${stats.bbox[1].toFixed(5)}, ${stats.bbox[0].toFixed(5)} → ${stats.bbox[3].toFixed(5)}, ${stats.bbox[2].toFixed(5)}`}
      />
    </div>
  );
}

export function LocationDetail({
  geo,
  loading,
}: {
  geo: GeocodeResult | null;
  loading: boolean;
}) {
  if (loading) {
    return <p className="text-sm text-neutral-400">Mencari lokasi...</p>;
  }

  if (!geo) {
    return <p className="text-sm text-neutral-400">Lokasi tidak ditemukan.</p>;
  }

  const items = [
    { label: "Desa/Kelurahan", value: geo.village },
    { label: "Kecamatan", value: geo.district },
    { label: "Kabupaten/Kota", value: geo.county },
    { label: "Provinsi", value: geo.state },
    { label: "Kode Pos", value: geo.postcode },
  ].filter((i) => i.value);

  return (
    <div>
      <p className="mb-3 text-sm leading-snug text-neutral-800">{geo.displayName ?? "Tidak diketahui"}</p>
      <div className="space-y-1 rounded-xl bg-neutral-50 p-3">
        {items.map((i) => (
          <div key={i.label} className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">{i.label}</span>
            <span className="font-medium text-neutral-700">{i.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
