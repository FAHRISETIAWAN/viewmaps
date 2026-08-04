"use client";

import { useState } from "react";
import { Check, Globe, Layers, Map, Moon, Mountain, Satellite, Sun } from "lucide-react";
import type { BasemapId } from "@/lib/basemaps";
import { BASEMAPS } from "@/lib/basemaps";

const ICONS: Record<BasemapId, typeof Layers> = {
  satelit: Satellite,
  hybrid: Globe,
  osm: Map,
  topo: Mountain,
  light: Sun,
  dark: Moon,
};

export default function LayerSwitcher({
  active,
  onChange,
}: {
  active: BasemapId;
  onChange: (id: BasemapId) => void;
}) {
  const [open, setOpen] = useState(false);
  const ActiveIcon = ICONS[active];

  return (
    <div className="absolute right-4 bottom-24 z-20 sm:bottom-auto sm:top-4">
      {open && <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />}

      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative z-20 flex h-11 w-11 items-center justify-center rounded-2xl shadow-xl ring-1 ring-black/5 transition-colors ${
          open ? "bg-neutral-900 text-white" : "bg-white text-neutral-600 hover:text-neutral-900"
        }`}
        title="Ganti basemap"
      >
        <ActiveIcon className="h-4.5 w-4.5" strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute right-0 bottom-13 z-20 w-52 overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 sm:bottom-auto sm:top-13">
          <p className="px-3 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            Basemap
          </p>
          {BASEMAPS.map((b) => {
            const Icon = ICONS[b.id];
            const isActive = b.id === active;
            return (
              <button
                key={b.id}
                onClick={() => {
                  onChange(b.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="flex-1">{b.name}</span>
                {isActive && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
