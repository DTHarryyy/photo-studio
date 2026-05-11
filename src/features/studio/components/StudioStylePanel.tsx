"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { StylePack } from "./StudioPreviewCard";

type Tab = "style" | "filter" | "layout";
const TABS: { id: Tab; label: string }[] = [
  { id: "style",  label: "Style"  },
  { id: "filter", label: "Filter" },
  { id: "layout", label: "Layout" },
];

const spring = { type: "spring" as const, damping: 28, stiffness: 320 };

interface Props {
  packs: StylePack[];
  activePack: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function StudioStylePanel({ packs, activePack, onSelect, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("style");

  return (
    <>
      {/* Scrim — always visible, closes panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      {/* ── Desktop: right drawer ─────────────────────────────────────── */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={spring}
        className="fixed right-0 top-0 z-40 hidden h-full w-72 flex-col border-l border-white/8 bg-black/70 backdrop-blur-2xl md:flex"
      >
        <PanelContent
          tab={tab}
          setTab={setTab}
          packs={packs}
          activePack={activePack}
          onSelect={onSelect}
          onClose={onClose}
        />
      </motion.div>

      {/* ── Mobile: bottom sheet ──────────────────────────────────────── */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={spring}
        className="fixed inset-x-0 bottom-0 z-40 flex max-h-[72vh] flex-col rounded-t-3xl border-t border-white/10 bg-black/80 backdrop-blur-2xl md:hidden"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>
        <PanelContent
          tab={tab}
          setTab={setTab}
          packs={packs}
          activePack={activePack}
          onSelect={onSelect}
          onClose={onClose}
        />
      </motion.div>
    </>
  );
}

// ─── Shared panel content ─────────────────────────────────────────────────────

function PanelContent({
  tab,
  setTab,
  packs,
  activePack,
  onSelect,
  onClose,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  packs: StylePack[];
  activePack: string;
  onSelect: (id: string) => void;
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
        {tab === "filter" && <PlaceholderTab label="Photo filters coming soon" />}
        {tab === "layout"  && <PlaceholderTab label="Layout options coming soon" />}
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

// ─── Placeholder tab ──────────────────────────────────────────────────────────

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="flex h-28 items-center justify-center">
      <p className="text-xs text-zinc-700">{label}</p>
    </div>
  );
}
