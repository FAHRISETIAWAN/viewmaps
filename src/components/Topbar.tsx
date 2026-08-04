"use client";

import { useState } from "react";
import { MapPin, Sparkles } from "lucide-react";
import { parseBoundary, SAMPLE_BOUNDARY } from "@/lib/parseBoundary";
import type { CoordOrder, LonLat } from "@/lib/types";

export default function Topbar({
  onResult,
}: {
  onResult: (ring: LonLat[] | null) => void;
}) {
  const [text, setText] = useState("");
  const [order, setOrder] = useState<CoordOrder>("lonlat");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    const { ring, error } = parseBoundary(text, order);
    if (error || ring.length < 4) {
      setError(error ?? "Titik koordinat kurang dari 3.");
      onResult(null);
      return;
    }
    setError(null);
    onResult(ring);
  }

  function handleSample() {
    setText(SAMPLE_BOUNDARY);
    setOrder("lonlat");
    const { ring, error } = parseBoundary(SAMPLE_BOUNDARY, "lonlat");
    setError(error ?? null);
    onResult(error ? null : ring);
  }

  return (
    <header className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-black/5 sm:px-4">
          <MapPin className="h-4 w-4 shrink-0 text-neutral-400" strokeWidth={2} />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Tempel batas koordinat: lon,lat,lon,lat,..."
            className="w-full min-w-0 bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 outline-none"
          />
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as CoordOrder)}
            className="shrink-0 rounded-lg bg-neutral-50 px-2 py-1 text-xs text-neutral-500 outline-none"
          >
            <option value="lonlat">Lon, Lat</option>
            <option value="latlon">Lat, Lon</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 shrink-0 rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 sm:flex-none"
          >
            Tampilkan
          </button>

          <button
            onClick={handleSample}
            title="Muat contoh batas"
            className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-white px-3 py-2.5 text-sm font-medium text-neutral-500 shadow-sm ring-1 ring-black/5 hover:text-neutral-700"
          >
            <Sparkles className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Contoh</span>
          </button>
        </div>
      </div>

      {error && <p className="px-1 text-xs font-medium text-red-500">{error}</p>}
    </header>
  );
}
