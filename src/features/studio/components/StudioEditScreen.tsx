"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { CapturedFrame } from "@/features/camera/types/camera.types";
import type { TemplateId } from "./StudioOrchestrator";
import type { StylePack } from "./StudioPreviewCard";
import { CompositeOutput } from "./CompositeOutput";
import { EditToolPanel } from "./EditToolPanel";
import { LayerRenderer } from "@/features/photobooth/layers/LayerRenderer";
import { useLayerStore } from "@/features/photobooth/store/useLayerStore";

interface Props {
  cols: number;
  rows: number;
  count: number;
  capturedFrames: (CapturedFrame | null)[];
  templateId: TemplateId;
  stylePack: StylePack;
  onBack: () => void;
  onDone: () => void;
}

/**
 * Compute the largest slot size that fits the composite on screen
 * given the available area (screen minus fixed chrome).
 */
function computeSlotSize(cols: number, rows: number): number {
  if (typeof window === "undefined") return 140;
  const TOP_BAR = 56;
  const TOOL_PANEL = 210;
  const PADDING = 48;
  const availW = window.innerWidth - 32;
  const availH = window.innerHeight - TOP_BAR - TOOL_PANEL - PADDING;
  const byWidth  = Math.floor(availW / cols);
  const byHeight = Math.floor(availH / rows);
  return Math.max(80, Math.min(byWidth, byHeight, 220));
}

export function StudioEditScreen({
  cols,
  rows,
  count,
  capturedFrames,
  templateId,
  stylePack,
  onBack,
  onDone,
}: Props) {
  const [slotSize] = useState(() => computeSlotSize(cols, rows));
  const compositeRef = useRef<HTMLDivElement>(null);
  const clearLayers = useLayerStore((s) => s.clearLayers);
  const layerCount = useLayerStore((s) => s.layers.length);
  const photoFilter = useLayerStore((s) => s.photoFilter);

  function handleBack() {
    clearLayers();
    onBack();
  }

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#0a0a12]"
    >
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/8 px-4 py-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M3.22 6.22a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L5.06 7l3.47-3.47a.75.75 0 0 0-1.06-1.06L3.22 6.22Z" />
          </svg>
          Retake
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-semibold text-white">Edit</span>
          {layerCount > 0 && (
            <span className="text-[9px] font-medium text-violet-400">
              {layerCount} layer{layerCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <button
          onClick={onDone}
          className="flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.4)] transition-all hover:bg-violet-500 active:scale-95"
        >
          Done
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M12.78 6.22a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L10.94 7 7.47 3.53a.75.75 0 0 1 1.06-1.06l4.25 4.25Z" />
          </svg>
        </button>
      </div>

      {/* ── Composite canvas ─────────────────────────────────────────────── */}
      <div
        className="flex flex-1 items-center justify-center overflow-hidden"
        style={{ padding: "20px 16px" }}
      >
        {/* Subtle dot-grid background cue */}
        <div className="relative">
          {/* Glow ring around composite */}
          <div
            className="absolute -inset-3 rounded-3xl opacity-30 blur-xl"
            style={{ background: `radial-gradient(ellipse, ${stylePack.color}60, transparent 70%)` }}
          />

          {/* Composite + layer overlay */}
          <div
            ref={compositeRef}
            className="relative"
            style={{ isolation: "isolate" }}
          >
            <CompositeOutput
              cols={cols}
              rows={rows}
              count={count}
              capturedFrames={capturedFrames}
              templateId={templateId}
              slotSize={slotSize}
              photoFilter={photoFilter}
            />
            <LayerRenderer compositeRef={compositeRef} />
          </div>
        </div>
      </div>

      {/* ── Always-visible tool panel ────────────────────────────────────── */}
      <EditToolPanel />
    </motion.div>
  );
}
