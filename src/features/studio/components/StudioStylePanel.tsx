"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { StylePack } from "./StudioPreviewCard";
import type { LayoutId, TemplateId } from "./StudioOrchestrator";
import type { PhotoFilter } from "@/features/photobooth/store/useLayerStore";

type Tab = "style" | "template" | "layout" | "filter";
const TABS: { id: Tab; label: string }[] = [
  { id: "style",    label: "Style"    },
  { id: "template", label: "Template" },
  { id: "layout",   label: "Layout"   },
  { id: "filter",   label: "Filter"   },
];

const spring = { type: "spring" as const, damping: 28, stiffness: 320 };

// SVG fractal-noise tile used as a grain overlay (URL-encoded for CSS backgroundImage)
const GRAIN_BG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// ─── Filter definitions ───────────────────────────────────────────────────────

const PHOTO_FILTERS: PhotoFilter[] = [
  { id: "none",      name: "OG",        css: "" },
  { id: "cute",      name: "Cute",      css: "brightness(1.12) contrast(0.88) saturate(1.4) hue-rotate(340deg)" },
  { id: "clarendon", name: "Clarendon", css: "brightness(1.08) contrast(1.25) saturate(1.35)" },
  { id: "lark",      name: "Lark",      css: "brightness(1.1) contrast(0.9) saturate(1.1) sepia(0.1)" },
  { id: "juno",      name: "Juno",      css: "sepia(0.15) saturate(1.5) contrast(1.05) brightness(1.05)" },
  { id: "reyes",     name: "Reyes",     css: "sepia(0.3) brightness(1.1) contrast(0.85) saturate(0.75)", vignette: 0.25 },
  { id: "crema",     name: "Crema",     css: "sepia(0.5) brightness(1.08) contrast(0.85) saturate(0.85)", vignette: 0.2, grain: true },
  { id: "valencia",  name: "Valencia",  css: "sepia(0.2) brightness(1.1) contrast(1.1) saturate(1.2)", vignette: 0.2 },
  { id: "aden",      name: "Aden",      css: "hue-rotate(340deg) saturate(0.85) brightness(1.1) contrast(0.9)", vignette: 0.3 },
  { id: "slumber",   name: "Slumber",   css: "saturate(0.65) brightness(1.08) hue-rotate(5deg)", grain: true },
  { id: "moon",      name: "Moon",      css: "grayscale(1) brightness(1.1) contrast(1.05)", vignette: 0.35 },
  { id: "noir",      name: "Noir",      css: "grayscale(1) contrast(1.3) brightness(0.88)", vignette: 0.5 },
  { id: "inkwell",   name: "Inkwell",   css: "grayscale(1) sepia(0.4) contrast(1.1) brightness(0.95)", vignette: 0.3, grain: true },
  { id: "charcoal",  name: "Charcoal",  css: "grayscale(1) contrast(1.6) brightness(0.8)", vignette: 0.5, grain: true },
  { id: "silver",    name: "Silver",    css: "grayscale(0.9) brightness(1.15) contrast(0.9)", vignette: 0.2 },
  { id: "amber",     name: "Amber",     css: "sepia(0.9) contrast(1.05)", vignette: 0.3, grain: true },
  { id: "golden",    name: "Golden",    css: "sepia(0.35) saturate(1.3) brightness(1.05)" },
  { id: "rust",      name: "Rust",      css: "sepia(0.6) saturate(1.2) hue-rotate(340deg) contrast(1.1)", vignette: 0.3, grain: true },
  { id: "haze",      name: "Haze",      css: "brightness(1.15) contrast(0.8) saturate(0.75)" },
  { id: "ink",       name: "Ink",       css: "contrast(1.45) brightness(0.85) saturate(0.7)", vignette: 0.4 },
  { id: "frost",     name: "Frost",     css: "hue-rotate(190deg) saturate(0.85) brightness(1.05)" },
  { id: "pop",       name: "Pop",       css: "saturate(1.5) contrast(1.05)" },
];

interface LayoutOption {
  id: LayoutId;
  name: string;
  cols: number;
  rows: number;
  count: number;
}

interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
}

interface Props {
  packs: StylePack[];
  activePack: string;
  onSelect: (id: string) => void;
  layouts: LayoutOption[];
  activeLayout: LayoutId;
  onLayoutChange: (id: LayoutId) => void;
  templates: TemplateOption[];
  activeTemplate: TemplateId;
  onTemplateChange: (id: TemplateId) => void;
  activeFilter: PhotoFilter | null;
  onFilterChange: (filter: PhotoFilter | null) => void;
  onClose: () => void;
}

export function StudioStylePanel({
  packs, activePack, onSelect,
  layouts, activeLayout, onLayoutChange,
  templates, activeTemplate, onTemplateChange,
  activeFilter, onFilterChange,
  onClose,
}: Props) {
  const [tab, setTab] = useState<Tab>("style");

  return (
    <>
      {/* Scrim — always visible, closes panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      {/* ── Desktop: right drawer ─────────────────────────────────────── */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={spring}
        className="fixed right-0 top-0 z-[60] hidden h-full w-72 flex-col border-l border-white/8 bg-black/70 backdrop-blur-2xl md:flex"
      >
        <PanelContent
          tab={tab} setTab={setTab}
          packs={packs} activePack={activePack} onSelect={onSelect}
          layouts={layouts} activeLayout={activeLayout} onLayoutChange={onLayoutChange}
          templates={templates} activeTemplate={activeTemplate} onTemplateChange={onTemplateChange}
          activeFilter={activeFilter} onFilterChange={onFilterChange}
          onClose={onClose}
        />
      </motion.div>

      {/* ── Mobile: bottom sheet ──────────────────────────────────────── */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={spring}
        className="fixed inset-x-0 bottom-0 z-[60] flex max-h-[72vh] flex-col rounded-t-3xl border-t border-white/10 bg-black/80 backdrop-blur-2xl md:hidden"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>
        <PanelContent
          tab={tab} setTab={setTab}
          packs={packs} activePack={activePack} onSelect={onSelect}
          layouts={layouts} activeLayout={activeLayout} onLayoutChange={onLayoutChange}
          templates={templates} activeTemplate={activeTemplate} onTemplateChange={onTemplateChange}
          activeFilter={activeFilter} onFilterChange={onFilterChange}
          onClose={onClose}
        />
      </motion.div>
    </>
  );
}

// ─── Shared panel content ─────────────────────────────────────────────────────

function PanelContent({
  tab, setTab,
  packs, activePack, onSelect,
  layouts, activeLayout, onLayoutChange,
  templates, activeTemplate, onTemplateChange,
  activeFilter, onFilterChange,
  onClose,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  packs: StylePack[];
  activePack: string;
  onSelect: (id: string) => void;
  layouts: LayoutOption[];
  activeLayout: LayoutId;
  onLayoutChange: (id: LayoutId) => void;
  templates: TemplateOption[];
  activeTemplate: TemplateId;
  onTemplateChange: (id: TemplateId) => void;
  activeFilter: PhotoFilter | null;
  onFilterChange: (filter: PhotoFilter | null) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between px-4 py-3.5">
        <p className="text-sm font-semibold text-white">Customise</p>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/8 hover:text-white"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-shrink-0 border-b border-white/8">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 py-2.5 text-xs font-semibold transition-colors",
              tab === t.id
                ? "border-b-2 border-violet-500 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === "style" && (
          <StyleTab packs={packs} activePack={activePack} onSelect={onSelect} />
        )}
        {tab === "template" && (
          <TemplateTab templates={templates} activeTemplate={activeTemplate} onTemplateChange={onTemplateChange} />
        )}
        {tab === "layout" && (
          <LayoutTab layouts={layouts} activeLayout={activeLayout} onLayoutChange={onLayoutChange} />
        )}
        {tab === "filter" && <FilterTab activeFilter={activeFilter} onFilterChange={onFilterChange} />}
      </div>
    </div>
  );
}

// ─── Style tab ────────────────────────────────────────────────────────────────

function StyleTab({
  packs,
  activePack,
  onSelect,
}: {
  packs: StylePack[];
  activePack: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        Style Packs
      </p>
      <div className="flex flex-col gap-1">
        {packs.map((pack) => {
          const isActive = pack.id === activePack;
          return (
            <button
              key={pack.id}
              onClick={() => onSelect(pack.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150",
                isActive
                  ? "bg-white/8 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <span
                className="h-7 w-7 flex-shrink-0 rounded-full ring-1 ring-white/10 shadow-lg"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${pack.color}cc, ${pack.color})`,
                  boxShadow: isActive ? `0 0 10px ${pack.color}60` : undefined,
                }}
              />
              <span className="flex-1 text-sm font-medium">{pack.name}</span>
              {isActive && (
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: pack.color }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Template tab ─────────────────────────────────────────────────────────────

const TEMPLATE_VISUALS: Record<TemplateId, { bg: string; border: string; extra?: string }> = {
  none:     { bg: "bg-zinc-800", border: "border-white/10" },
  polaroid: { bg: "bg-white",    border: "border-white/20", extra: "pb-5" },
  film:     { bg: "bg-black",    border: "border-zinc-800" },
};

function TemplateTab({
  templates,
  activeTemplate,
  onTemplateChange,
}: {
  templates: TemplateOption[];
  activeTemplate: TemplateId;
  onTemplateChange: (id: TemplateId) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        Templates
      </p>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((tpl) => {
          const isActive = tpl.id === activeTemplate;
          const vis = TEMPLATE_VISUALS[tpl.id];
          return (
            <button
              key={tpl.id}
              onClick={() => onTemplateChange(tpl.id)}
              className={cn(
                "flex flex-col overflow-hidden rounded-xl border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                isActive
                  ? "border-violet-500/60 bg-violet-600/15 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                  : "border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]"
              )}
            >
              {/* Frame style preview */}
              <div className="p-2.5">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-black/40">
                  {tpl.id === "film" ? (
                    /* Film: vertical sprocket rails left + right */
                    <div className="flex h-full items-stretch" style={{ background: "#000" }}>
                      {/* Left rail */}
                      <div className="flex w-2.5 flex-col items-center justify-around py-1">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="rounded-[1px] bg-white/85" style={{ width: 4, height: 4 }} />
                        ))}
                      </div>
                      {/* Photos + footer */}
                      <div className="flex flex-1 flex-col" style={{ padding: "3px 3px 0 3px", gap: 3 }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex-1 rounded-[2px] bg-white/15" />
                        ))}
                        <div style={{ height: 8 }} />
                      </div>
                      {/* Right rail */}
                      <div className="flex w-2.5 flex-col items-center justify-around py-1">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="rounded-[1px] bg-white/85" style={{ width: 4, height: 4 }} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={cn("h-full w-full flex flex-col")}>
                      <div className={cn(
                        "flex-1 m-1 rounded-sm overflow-hidden",
                        vis.bg, vis.border, "border",
                        vis.extra
                      )}>
                        <div className="grid h-full grid-cols-2 grid-rows-2 gap-0.5 p-0.5">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "rounded-[1px]",
                                tpl.id === "polaroid" ? "bg-zinc-200" : "bg-white/15"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Label */}
              <div className="px-2 pb-2.5 text-center">
                <p className={cn(
                  "text-[11px] font-semibold",
                  isActive ? "text-violet-300" : "text-zinc-400"
                )}>
                  {tpl.name}
                </p>
                <p className="mt-0.5 text-[10px] text-zinc-600">{tpl.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Layout tab ───────────────────────────────────────────────────────────────

function LayoutTab({
  layouts,
  activeLayout,
  onLayoutChange,
}: {
  layouts: LayoutOption[];
  activeLayout: LayoutId;
  onLayoutChange: (id: LayoutId) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        Layouts
      </p>
      <p className="mb-3 text-[11px] leading-relaxed text-zinc-600">
        Switching layout resets your current captures.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {layouts.map((layout) => {
          const isActive = layout.id === activeLayout;
          return (
            <button
              key={layout.id}
              onClick={() => onLayoutChange(layout.id)}
              className={cn(
                "flex flex-col overflow-hidden rounded-xl border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                isActive
                  ? "border-violet-500/60 bg-violet-600/15 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                  : "border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]"
              )}
            >
              {/* Mini grid preview — fixed square so all cards are the same height */}
              <div className="p-2.5">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-black/40">
                  <div
                    className="h-full w-full"
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                      gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                      gap: "3px",
                      padding: "4px",
                    }}
                  >
                    {Array.from({ length: layout.cols * layout.rows }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-md transition-colors",
                          isActive ? "bg-violet-400/50" : "bg-white/20"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="px-2 pb-2.5 text-center">
                <p className={cn(
                  "text-[11px] font-semibold leading-tight",
                  isActive ? "text-violet-300" : "text-zinc-400"
                )}>
                  {layout.name}
                </p>
                <p className="mt-0.5 text-[10px] text-zinc-600">
                  {layout.count} photo{layout.count !== 1 ? "s" : ""}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Filter tab ───────────────────────────────────────────────────────────────

function FilterTab({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: PhotoFilter | null;
  onFilterChange: (filter: PhotoFilter | null) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        Filters
      </p>
      <div className="grid grid-cols-3 gap-2">
        {PHOTO_FILTERS.map((f) => {
          const isActive = f.id === "none" ? activeFilter === null : activeFilter?.id === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id === "none" ? null : f)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all",
                isActive
                  ? "border-violet-500/60 bg-violet-600/15 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                  : "border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]"
              )}
            >
              {/* Filter preview with vignette + grain overlays */}
              <div className="relative h-12 w-full overflow-hidden rounded-lg">
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, #f472b6 0%, #818cf8 50%, #34d399 100%)",
                    filter: f.css || undefined,
                  }}
                />
                {f.vignette && (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${f.vignette}) 100%)`,
                    }}
                  />
                )}
                {f.grain && (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage: GRAIN_BG,
                      backgroundRepeat: "repeat",
                      backgroundSize: "100px 100px",
                      mixBlendMode: "overlay",
                      opacity: 0.3,
                    }}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold",
                  isActive ? "text-violet-300" : "text-zinc-500"
                )}
              >
                {f.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

