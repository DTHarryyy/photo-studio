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

// ─── Background assets ────────────────────────────────────────────────────────

const PHOTO_BACKGROUNDS: string[] = [
  "/assets/styles_background/%23wallpaper%20%23star_.jpg",
  "/assets/styles_background/Denimmmmmm.jpg",
  "/assets/styles_background/blue%20stars%20%F0%9F%92%99_.jpg",
  "/assets/styles_background/download.jpg",
  "/assets/styles_background/download%20(1).jpg",
  "/assets/styles_background/download%20(2).jpg",
  "/assets/styles_background/download%20(3).jpg",
  "/assets/styles_background/download%20(4).jpg",
  "/assets/styles_background/download%20(5).jpg",
  "/assets/styles_background/download%20(6).jpg",
  "/assets/styles_background/download%20(7).jpg",
  "/assets/styles_background/download%20(8).jpg",
  "/assets/styles_background/download%20(9).jpg",
  "/assets/styles_background/download%20(10).jpg",
  "/assets/styles_background/download%20(11).jpg",
  "/assets/styles_background/download%20(12).jpg",
  "/assets/styles_background/download%20(13).jpg",
  "/assets/styles_background/download%20(14).jpg",
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
  activeBackground: string | null;
  onBackgroundChange: (bg: string | null) => void;
  onClose: () => void;
}

export function StudioStylePanel({
  packs, activePack, onSelect,
  layouts, activeLayout, onLayoutChange,
  templates, activeTemplate, onTemplateChange,
  activeFilter, onFilterChange,
  activeBackground, onBackgroundChange,
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
          activeBackground={activeBackground} onBackgroundChange={onBackgroundChange}
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
          activeBackground={activeBackground} onBackgroundChange={onBackgroundChange}
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
  activeBackground, onBackgroundChange, // passed through to StyleTab
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
  activeBackground: string | null;
  onBackgroundChange: (bg: string | null) => void;
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
          <StyleTab
            packs={packs} activePack={activePack} onSelect={onSelect}
            activeBackground={activeBackground} onBackgroundChange={onBackgroundChange}
          />
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
  activeBackground,
  onBackgroundChange,
}: {
  packs: StylePack[];
  activePack: string;
  onSelect: (id: string) => void;
  activeBackground: string | null;
  onBackgroundChange: (bg: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Style packs */}
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

      {/* Backgrounds */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Backgrounds
        </p>
        <div className="grid grid-cols-3 gap-2">
          {/* None tile */}
          <button
            onClick={() => onBackgroundChange(null)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-xl border transition-all duration-150",
              activeBackground === null
                ? "border-violet-500/70 shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                : "border-white/8 hover:border-white/20"
            )}
          >
            <div className="flex h-full w-full items-center justify-center bg-zinc-900">
              <svg className="h-5 w-5 text-zinc-600" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                <path d="M4 4l12 12M16 4L4 16" />
              </svg>
            </div>
            {activeBackground === null && (
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-violet-500" />
            )}
          </button>

          {PHOTO_BACKGROUNDS.map((src) => {
            const isActive = activeBackground === src;
            return (
              <button
                key={src}
                onClick={() => onBackgroundChange(src)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl border transition-all duration-150 hover:scale-[1.04] active:scale-[0.97]",
                  isActive
                    ? "border-violet-500/70 shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                    : "border-white/8 hover:border-white/20"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
                {isActive && (
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-violet-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Template tab ─────────────────────────────────────────────────────────────

const TEMPLATE_VISUALS: Record<TemplateId, { bg: string; border: string; extra?: string }> = {
  none:      { bg: "bg-zinc-800",    border: "border-white/10" },
  polaroid:  { bg: "bg-[#FFFDF5]",  border: "border-white/20",       extra: "pb-5" },
  film:      { bg: "bg-black",       border: "border-zinc-800" },
  instax:    { bg: "bg-[#FAFAF8]",  border: "border-white/30",       extra: "pb-8" },
  vintage:   { bg: "bg-[#F5EDD6]",  border: "border-[#B48C50]/50" },
  minimal:   { bg: "bg-white",       border: "border-gray-300/60" },
  dark:      { bg: "bg-[#111]",      border: "border-zinc-700/60" },
  scrapbook: { bg: "bg-[#EED9B8]",  border: "border-[#C8956C]/60" },
  neon:      { bg: "bg-[#050508]",  border: "border-violet-500/50" },
  pastel:    { bg: "bg-[#F0EBFF]",  border: "border-violet-300/40" },
  strip:     { bg: "bg-white",       border: "border-gray-200" },
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
                                ["polaroid","instax","minimal","strip"].includes(tpl.id)
                                  ? "bg-zinc-200"
                                  : tpl.id === "vintage" || tpl.id === "scrapbook"
                                  ? "bg-[#C8A86B]/40"
                                  : tpl.id === "pastel"
                                  ? "bg-violet-200/60"
                                  : tpl.id === "neon"
                                  ? "bg-violet-500/30"
                                  : "bg-white/15"
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

function LayoutPreviewCell({ isActive }: { isActive: boolean }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 3,
        background: isActive
          ? "linear-gradient(160deg, rgba(167,139,250,0.55) 0%, rgba(109,40,217,0.35) 100%)"
          : "linear-gradient(160deg, rgba(148,163,184,0.22) 0%, rgba(71,85,105,0.14) 100%)",
        border: isActive
          ? "0.5px solid rgba(167,139,250,0.4)"
          : "0.5px solid rgba(148,163,184,0.12)",
      }}
    >
      {/* Simulated photo content: a horizon line + sky glint */}
      <div className="absolute inset-0">
        <div className="absolute left-0 right-0 top-[28%] h-[40%]"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-[15%] right-[15%]"
          style={{
            bottom: "28%",
            height: "0.5px",
            background: isActive
              ? "rgba(196,181,253,0.25)"
              : "rgba(148,163,184,0.18)",
          }}
        />
      </div>
    </div>
  );
}

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
      <div className="grid grid-cols-2 gap-2.5">
        {layouts.map((layout) => {
          const isActive = layout.id === activeLayout;
          return (
            <button
              key={layout.id}
              onClick={() => onLayoutChange(layout.id)}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                isActive
                  ? "border-violet-500/50 bg-violet-950/50 shadow-[0_0_18px_rgba(139,92,246,0.22)]"
                  : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.06]"
              )}
            >
              {/* Preview — fixed square aspect, cells show the actual layout structure */}
              <div className="p-2.5">
                <div
                  className="aspect-square w-full overflow-hidden rounded-xl"
                  style={{
                    background: isActive
                      ? "rgba(46,16,101,0.6)"
                      : "rgba(9,9,11,0.7)",
                    border: isActive
                      ? "1px solid rgba(139,92,246,0.2)"
                      : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                      gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                      gap: 3,
                      padding: 5,
                    }}
                  >
                    {Array.from({ length: layout.cols * layout.rows }).map((_, i) => (
                      <LayoutPreviewCell key={i} isActive={isActive} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="px-2 pb-3 text-center">
                <p className={cn(
                  "text-[11px] font-semibold leading-tight",
                  isActive ? "text-violet-300" : "text-zinc-300"
                )}>
                  {layout.name}
                </p>
                <p className="mt-0.5 text-[10px] text-zinc-500">
                  {layout.count} photo{layout.count !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Active check badge */}
              {isActive && (
                <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
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

