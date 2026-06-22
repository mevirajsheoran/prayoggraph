"use client";

import { memo } from "react";
import { getActiveComponents, getLockedComponents } from "@/lib/constants";
import { PaletteHeader } from "./PaletteHeader";
import { PaletteCard } from "./PaletteCard";
import { PaletteLocked } from "./PaletteLocked";
import { PaletteFooter } from "./PaletteFooter";

export const ComponentPalette = memo(function ComponentPalette() {
  const active = getActiveComponents();
  const locked = getLockedComponents();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border-default bg-bg-secondary/60 backdrop-blur-md">
      <PaletteHeader activeCount={active.length} totalCount={active.length + locked.length} />

      <div className="flex-1 overflow-y-auto p-3">
        {/* Active components */}
        <div className="space-y-1.5">
          {active.map((meta) => (
            <PaletteCard key={meta.kind} meta={meta} />
          ))}
        </div>

        {/* Locked components */}
        <PaletteLocked />
      </div>

      <PaletteFooter />
    </aside>
  );
});