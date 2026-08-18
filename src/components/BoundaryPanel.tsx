"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, TriangleAlert, X } from "lucide-react";
import { LocationDetail, StatsDetail } from "./InfoPanel";
import type { GeocodeResult, Parcel } from "@/lib/types";

type Tab = "statistik" | "lokasi";

const TABS: [Tab, string][] = [
  ["statistik", "Statistik"],
  ["lokasi", "Lokasi"],
];

function ParcelCard({
  parcel,
  geo,
  geoLoading,
  onRemove,
}: {
  parcel: Parcel;
  geo: GeocodeResult | null;
  geoLoading: boolean;
  onRemove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<Tab>("statistik");

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-neutral-100">
      <div className="flex items-center gap-2 px-2.5 py-2">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: parcel.color }}
        />
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {geo?.village ?? parcel.label}
            </p>
            <p className="truncate text-xs text-neutral-400">
              {parcel.stats.vertexCount} titik &middot; {parcel.stats.areaHa.toFixed(2)} ha
            </p>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-neutral-400" strokeWidth={2.5} />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" strokeWidth={2.5} />
          )}
        </button>
        <button
          onClick={() => onRemove(parcel.id)}
          title="Hapus bidang"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-500"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-neutral-100 bg-neutral-50/50 px-3 py-3">
          <div className="mb-2 flex gap-1">
            {TABS.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  tab === key ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {tab === "statistik" && <StatsDetail stats={parcel.stats} />}
          {tab === "lokasi" && <LocationDetail geo={geo} loading={geoLoading} />}
        </div>
      )}
    </div>
  );
}

export default function BoundaryPanel({
  parcels,
  geoMap,
  onRemove,
  onClear,
}: {
  parcels: Parcel[];
  geoMap: Record<string, GeocodeResult | null>;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute left-4 right-4 top-4 z-20 flex max-h-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/10 ring-1 ring-black/5 sm:right-auto sm:w-[380px]">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={`flex items-center justify-between gap-2 px-4 py-2.5 text-left text-xs font-medium transition-colors ${
          parcels.length > 0
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
        }`}
      >
        <span className="flex items-center gap-2">
          {parcels.length > 0 ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
          ) : (
            <TriangleAlert className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
          )}
          {parcels.length > 0
            ? `${parcels.length} bidang ditampilkan`
            : "Belum ada bidang dimasukkan"}
        </span>
        {collapsed ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
        ) : (
          <ChevronUp className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
        )}
      </button>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-3">
          {parcels.length === 0 ? (
            <p className="p-1 text-sm text-neutral-400">
              Masukkan batas koordinat di atas lalu klik &ldquo;Tambahkan&rdquo;. Bisa lebih dari
              satu bidang sekaligus.
            </p>
          ) : (
            <div className="space-y-2">
              {parcels.map((parcel) => (
                <ParcelCard
                  key={parcel.id}
                  parcel={parcel}
                  geo={geoMap[parcel.id] ?? null}
                  geoLoading={!(parcel.id in geoMap)}
                  onRemove={onRemove}
                />
              ))}
            </div>
          )}

          {parcels.length > 0 && (
            <button
              onClick={onClear}
              className="mt-3 w-full rounded-xl bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-500 hover:bg-neutral-200"
            >
              Bersihkan Semua
            </button>
          )}
        </div>
      )}
    </div>
  );
}
