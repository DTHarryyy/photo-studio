"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import type { LayoutConfig, Theme } from "./layout-card.config";
export type { LayoutType, LayoutConfig } from "./layout-card.config";
export { LAYOUT_CONFIGS } from "./layout-card.config";

// ─── Theme tokens ────────────────────────────────────────────────────────────
// All classes are complete static strings so Tailwind JIT can detect them.

interface ThemeTokens {
  gradient: string;
  shadow: string;
  ring: string;
  cellBase: string;
  cellHover: string;
}

const THEMES: Record<Theme, ThemeTokens> = {
  pink: {
    gradient:  "from-pink-500 via-fuchsia-400 to-rose-300",
    shadow:    "shadow-[0_20px_60px_rgba(236,72,153,0.55),0_4px_24px_rgba(236,72,153,0.3)]",
    ring:      "ring-pink-400/80",
    cellBase:  "bg-white/20 border border-white/35",
    cellHover: "group-hover:bg-white/32 group-hover:border-white/50",
  },
  violet: {
    gradient:  "from-violet-600 via-purple-500 to-violet-300",
    shadow:    "shadow-[0_20px_60px_rgba(124,58,237,0.55),0_4px_24px_rgba(124,58,237,0.3)]",
    ring:      "ring-violet-400/80",
    cellBase:  "bg-white/20 border border-white/35",
    cellHover: "group-hover:bg-white/32 group-hover:border-white/50",
  },
  blue: {
    gradient:  "from-blue-600 via-sky-500 to-indigo-300",
    shadow:    "shadow-[0_20px_60px_rgba(59,130,246,0.55),0_4px_24px_rgba(59,130,246,0.3)]",
    ring:      "ring-blue-400/80",
    cellBase:  "bg-white/20 border border-white/35",
    cellHover: "group-hover:bg-white/32 group-hover:border-white/50",
  },
  cyan: {
    gradient:  "from-cyan-500 via-teal-400 to-sky-300",
    shadow:    "shadow-[0_20px_60px_rgba(6,182,212,0.55),0_4px_24px_rgba(6,182,212,0.3)]",
    ring:      "ring-cyan-400/80",
    cellBase:  "bg-white/20 border border-white/35",
    cellHover: "group-hover:bg-white/32 group-hover:border-white/50",
  },
  amber: {
    gradient:  "from-amber-500 via-orange-400 to-yellow-300",
    shadow:    "shadow-[0_20px_60px_rgba(245,158,11,0.55),0_4px_24px_rgba(245,158,11,0.3)]",
    ring:      "ring-amber-400/80",
    cellBase:  "bg-white/20 border border-white/35",
    cellHover: "group-hover:bg-white/32 group-hover:border-white/50",
  },
};

// ─── GridPreview ─────────────────────────────────────────────────────────────
// Renders visual photo-slot shapes — not text labels.

function GridPreview({
  cols,
  rows,
  cellBase,
  cellHover,
}: {
  cols: number;
  rows: number;
  cellBase: string;
  cellHover: string;
}) {
  return (
    <div
      className="grid w-full h-full gap-[7px] p-3"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: cols * rows }, (_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-xl transition-all duration-300",
            cellBase,
            cellHover
          )}
        />
      ))}
    </div>
  );
}

// ─── LayoutCard ───────────────────────────────────────────────────────────────

interface LayoutCardProps {
  config: LayoutConfig;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export function LayoutCard({
  config,
  selected = false,
  onClick,
  className,
  style,
}: LayoutCardProps) {
  const t = THEMES[config.theme];

  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={cn(
        // Structure
        "group relative flex flex-col w-full h-full overflow-hidden rounded-[28px]",
        // Spring-like hover transition
        "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        // Hover: lift + scale
        "hover:-translate-y-3 hover:scale-[1.04]",
        // Depth shadow + glow
        t.shadow,
        // Selected: neon ring
        selected && "ring-2 ring-offset-2 ring-offset-zinc-950",
        selected && t.ring,
        className
      )}
    >
      {/* Gradient fill — the visual identity of the card */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", t.gradient)} />

      {/* Specular highlight from top */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/22 via-transparent to-black/25" />

      {/* Grid preview — the main visual content */}
      <div className="relative z-10 flex-1 p-3">
        <div className="h-full w-full rounded-2xl bg-black/28 border border-white/15 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-black/18 group-hover:border-white/25">
          <GridPreview
            cols={config.cols}
            rows={config.rows}
            cellBase={t.cellBase}
            cellHover={t.cellHover}
          />
        </div>
      </div>

      {/* Label pill */}
      <div className="relative z-10 px-3 pb-3">
        <div className="rounded-2xl bg-black/40 px-3 py-2 text-center border border-white/10 backdrop-blur-sm">
          <p className="text-[11px] font-semibold text-white tracking-wide leading-none">
            {config.label}
          </p>
          <p className="text-[9px] text-white/55 mt-1 leading-none">{config.subtitle}</p>
        </div>
      </div>

      {/* Selected state: animated ring overlay */}
      {selected && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[28px] ring-2 animate-ring-pulse",
            t.ring
          )}
        />
      )}
    </button>
  );
}
