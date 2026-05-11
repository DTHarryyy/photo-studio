"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { StylePack } from "./StudioPreviewCard";
import type { LayoutId, TemplateId } from "./StudioOrchestrator";
import { useLayerStore } from "@/features/photobooth/store/useLayerStore";

type Tab = "style" | "template" | "layout" | "filter" | "stickers" | "text";
const TABS: { id: Tab; label: string }[] = [
  { id: "style",    label: "Style"    },
  { id: "template", label: "Template" },
  { id: "layout",   label: "Layout"   },
  { id: "filter",   label: "Filter"   },
  { id: "stickers", label: "Stickers" },
  { id: "text",     label: "Text"     },
];

const spring = { type: "spring" as const, damping: 28, stiffness: 320 };

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
  onClose: () => void;
}

export function StudioStylePanel({
  packs, activePack, onSelect,
  layouts, activeLayout, onLayoutChange,
  templates, activeTemplate, onTemplateChange,
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

      {/* Tabs — scrollable so all 6 fit */}
      <div className="flex flex-shrink-0 overflow-x-auto border-b border-white/8 scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-shrink-0 px-3 py-2.5 text-xs font-semibold transition-colors",
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
        {tab === "filter" && <PlaceholderTab label="Photo filters coming soon" />}
        {tab === "stickers" && <StickersTab />}
        {tab === "text" && <TextTab />}
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

// ─── Placeholder tab ──────────────────────────────────────────────────────────

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="flex h-28 items-center justify-center">
      <p className="text-xs text-zinc-700">{label}</p>
    </div>
  );
}

// ─── Sticker library (OpenMoji SVGs) ─────────────────────────────────────────

const STICKER_DEFS: { src: string; name: string; category: string }[] = [
  // Fun
  { src: "/assets/stickers/sparkles.svg",    name: "Sparkles",    category: "fun"   },
  { src: "/assets/stickers/fire.svg",        name: "Fire",        category: "fun"   },
  { src: "/assets/stickers/party-popper.svg",name: "Party",       category: "fun"   },
  { src: "/assets/stickers/balloon.svg",     name: "Balloon",     category: "fun"   },
  { src: "/assets/stickers/confetti.svg",    name: "Confetti",    category: "fun"   },
  { src: "/assets/stickers/dizzy.svg",       name: "Dizzy",       category: "fun"   },
  { src: "/assets/stickers/rainbow.svg",     name: "Rainbow",     category: "fun"   },
  { src: "/assets/stickers/star.svg",        name: "Star",        category: "fun"   },
  { src: "/assets/stickers/star-glow.svg",   name: "Glowing Star",category: "fun"   },
  // Hearts
  { src: "/assets/stickers/heart.svg",       name: "Heart",       category: "hearts"},
  { src: "/assets/stickers/hearts-two.svg",  name: "Two Hearts",  category: "hearts"},
  { src: "/assets/stickers/heart-spark.svg", name: "Sparkling",   category: "hearts"},
  { src: "/assets/stickers/hearts-face.svg", name: "Heart Face",  category: "hearts"},
  { src: "/assets/stickers/hundred.svg",     name: "100",         category: "hearts"},
  // Faces
  { src: "/assets/stickers/sunglasses.svg",  name: "Cool",        category: "faces" },
  { src: "/assets/stickers/party-face.svg",  name: "Party",       category: "faces" },
  { src: "/assets/stickers/heart-eyes.svg",  name: "Heart Eyes",  category: "faces" },
  { src: "/assets/stickers/star-struck.svg", name: "Star Struck", category: "faces" },
  { src: "/assets/stickers/wink.svg",        name: "Wink",        category: "faces" },
  // Style
  { src: "/assets/stickers/crown.svg",       name: "Crown",       category: "style" },
  { src: "/assets/stickers/diamond.svg",     name: "Diamond",     category: "style" },
  { src: "/assets/stickers/blossom.svg",     name: "Blossom",     category: "style" },
  { src: "/assets/stickers/butterfly.svg",   name: "Butterfly",   category: "style" },
  { src: "/assets/stickers/sunflower.svg",   name: "Sunflower",   category: "style" },
  { src: "/assets/stickers/camera.svg",      name: "Camera",      category: "style" },
  { src: "/assets/stickers/clover.svg",      name: "Clover",      category: "style" },
];
const STICKER_CATEGORIES = [...new Set(STICKER_DEFS.map((s) => s.category))];

// ─── Stickers tab ─────────────────────────────────────────────────────────────

function StickersTab() {
  const [activeCategory, setActiveCategory] = useState(STICKER_CATEGORIES[0]);
  const { addSticker, layers, selectedId, updateLayer } = useLayerStore();

  const selectedSticker = layers.find(
    (l) => l.id === selectedId && l.type === "sticker"
  ) as Extract<typeof layers[number], { type: "sticker" }> | undefined;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        Stickers
      </p>

      {/* Category filter */}
      <div className="flex gap-1 flex-wrap">
        {STICKER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize transition-colors",
              cat === activeCategory
                ? "bg-violet-600 text-white"
                : "bg-white/8 text-zinc-400 hover:bg-white/12 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sticker grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {STICKER_DEFS.filter((s) => s.category === activeCategory).map((s) => (
          <button
            key={s.src}
            onClick={() => addSticker(s.src, s.name)}
            title={s.name}
            className="flex aspect-square items-center justify-center rounded-xl bg-white/5 p-1.5 transition-all hover:bg-white/12 hover:scale-110 active:scale-95"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.name} className="h-full w-full object-contain" draggable={false} />
          </button>
        ))}
      </div>

      {/* Selected sticker size control */}
      {selectedSticker && (
        <div className="mt-1 flex flex-col gap-2 rounded-xl border border-white/8 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">Size</p>
            <span className="text-[10px] text-zinc-500">{Math.round(selectedSticker.size)}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            step={1}
            value={selectedSticker.size}
            onChange={(e) => updateLayer(selectedSticker.id, { size: Number(e.target.value) })}
            className="w-full accent-violet-500"
          />
        </div>
      )}

      <p className="text-[10px] leading-relaxed text-zinc-700">
        Tap a sticker to add it. Drag to reposition.
      </p>
    </div>
  );
}

// ─── Text tab ─────────────────────────────────────────────────────────────────

const TEXT_COLORS = [
  "#ffffff", "#000000", "#f87171", "#fb923c", "#facc15",
  "#4ade80", "#60a5fa", "#c084fc", "#f472b6",
];

const FONT_OPTIONS = [
  { label: "Sans", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Mono", value: "monospace" },
];

function TextTab() {
  const { addText, layers, selectedId, updateLayer } = useLayerStore();

  const selectedText = layers.find(
    (l) => l.id === selectedId && l.type === "text"
  ) as Extract<typeof layers[number], { type: "text" }> | undefined;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        Text
      </p>

      <button
        onClick={addText}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] py-3 text-sm font-medium text-zinc-400 transition-all hover:border-violet-500/50 hover:bg-violet-600/10 hover:text-white"
      >
        <span className="text-lg leading-none">T</span>
        Add Text
      </button>

      {selectedText && (
        <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Selected text
          </p>

          {/* Font size */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-zinc-500">Size</p>
              <span className="text-[10px] text-zinc-500">{Math.round(selectedText.fontSize)}%</span>
            </div>
            <input
              type="range"
              min={4}
              max={25}
              step={0.5}
              value={selectedText.fontSize}
              onChange={(e) => updateLayer(selectedText.id, { fontSize: Number(e.target.value) })}
              className="w-full accent-violet-500"
            />
          </div>

          {/* Font family */}
          <div className="flex gap-1">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f.value}
                onClick={() => updateLayer(selectedText.id, { fontFamily: f.value })}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors",
                  selectedText.fontFamily === f.value
                    ? "bg-violet-600 text-white"
                    : "bg-white/8 text-zinc-400 hover:bg-white/12"
                )}
                style={{ fontFamily: f.value }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Color picker */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] text-zinc-500">Color</p>
            <div className="flex flex-wrap gap-1.5">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => updateLayer(selectedText.id, { color: c })}
                  className={cn(
                    "h-6 w-6 rounded-full ring-offset-1 ring-offset-black transition-all",
                    selectedText.color === c ? "ring-2 ring-violet-400" : "ring-1 ring-white/10"
                  )}
                  style={{ background: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="text-[10px] leading-relaxed text-zinc-700">
        Tap "Add Text" to place text. Drag to move. Double-click to edit.
      </p>
    </div>
  );
}
