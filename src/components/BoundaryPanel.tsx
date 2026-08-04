"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, MapPin, TriangleAlert } from "lucide-react";
import { LocationDetail, StatsDetail } from "./InfoPanel";
import type { BoundaryStats, GeocodeResult } from "@/lib/types";

type Tab = "statistik" | "lokasi";

const TABS: [Tab, string][] = [
  ["statistik", "Statistik"],
  ["lokasi", "Lokasi"],
];

export default function BoundaryPanel({
  stats,
  geo,
  geoLoading,
}: {
  stats: BoundaryStats | null;
  geo: GeocodeResult | null;
  geoLoading: boolean;
}) {
  const [tab, setTab] = useState<Tab>("statistik");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute left-4 right-4 top-4 z-20 flex max-h-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/10 ring-1 ring-black/5 sm:right-auto sm:w-[380px]">
      {stats ? (
        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
          Poligon tertutup &amp; valid
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-700">
          <TriangleAlert className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
          Belum ada batas dimasukkan
        </div>
      )}

      <button
        onClick={() => setCollapsed((c) => !c)}
        className={`flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-neutral-50 ${
          !collapsed ? "border-b border-neutral-100" : ""
        }`}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
          <MapPin className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {geo?.village ?? (stats ? "Bidang Tanah" : "Belum ada bidang")}
          </p>
          <p className="truncate text-xs text-neutral-400">
            {stats ? `${stats.vertexCount} titik batas` : "Masukkan koordinat untuk mulai"}
          </p>
        </div>
        {stats && (
          <div className="flex h-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 px-3 text-xs font-semibold text-white">
            {stats.areaHa.toFixed(2)} ha
          </div>
        )}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400">
          {collapsed ? (
            <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
          ) : (
            <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
          )}
        </div>
      </button>

      {!collapsed && stats && (
        <div className="grid grid-cols-2 divide-x divide-neutral-100 border-b border-neutral-100">
          <div className="px-4 py-3">
            <p className="text-[11px] text-neutral-400">Keliling</p>
            <p className="mt-0.5 text-sm font-semibold text-neutral-800">
              {stats.perimeterM.toLocaleString("id-ID", { maximumFractionDigits: 0 })} m
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[11px] text-neutral-400">Luas</p>
            <p className="mt-0.5 text-sm font-semibold text-neutral-800">
              {stats.areaM2.toLocaleString("id-ID", { maximumFractionDigits: 0 })} m²
            </p>
          </div>
        </div>
      )}

      {!collapsed && (
        <>
          <div className="flex gap-1 px-3 pt-3">
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

          <div className="flex-1 overflow-y-auto p-4">
            {tab === "statistik" &&
              (stats ? (
                <StatsDetail stats={stats} />
              ) : (
                <p className="text-sm text-neutral-400">Belum ada data untuk ditampilkan.</p>
              ))}
            {tab === "lokasi" &&
              (stats ? (
                <LocationDetail geo={geo} loading={geoLoading} />
              ) : (
                <p className="text-sm text-neutral-400">Belum ada data untuk ditampilkan.</p>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
