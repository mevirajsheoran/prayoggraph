"use client";

import { memo } from "react";
import { Lock } from "lucide-react";
import { getLockedComponents } from "@/lib/constants";
import { PaletteCard } from "./PaletteCard";

export const PaletteLocked = memo(function PaletteLocked() {
  const locked = getLockedComponents();

  return (
    <div className="mt-4 border-t border-border-default pt-4">
      <div className="mb-2 flex items-center gap-2 px-1">
        <Lock className="h-2.5 w-2.5 text-text-muted" />
        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-text-muted">
          Coming Soon
        </span>
      </div>
      <div className="space-y-1.5">
        {locked.map((meta) => (
          <PaletteCard key={meta.kind} meta={meta} />
        ))}
      </div>
    </div>
  );
});