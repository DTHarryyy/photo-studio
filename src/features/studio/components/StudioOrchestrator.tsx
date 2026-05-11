"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useCamera } from "@/features/camera/hooks/useCamera";
import { useCameraStore } from "@/features/camera/store/camera.store";
import { StudioCamera } from "./StudioCamera";
import { StudioTopBar } from "./StudioTopBar";
import { StudioPreviewCard } from "./StudioPreviewCard";
import { StudioCaptureBar } from "./StudioCaptureBar";
import { StudioStylePanel } from "./StudioStylePanel";
import { StudioResultScreen } from "./StudioResultScreen";

// ─── Layout config ────────────────────────────────────────────────────────────

const LAYOUT_MAP = {
  "1photo":   { cols: 1, rows: 1, count: 1 },
  "2side":    { cols: 2, rows: 1, count: 2 },
  "2stacked": { cols: 1, rows: 2, count: 2 },
  "3stacked": { cols: 1, rows: 3, count: 3 },
  "4grid":    { cols: 2, rows: 2, count: 4 },
  "3strip":   { cols: 3, rows: 1, count: 3 },
} as const;

export type LayoutId = keyof typeof LAYOUT_MAP;

export const LAYOUT_LIST: { id: LayoutId; name: string; cols: number; rows: number; count: number }[] = [
  { id: "1photo",   name: "1 Photo",        cols: 1, rows: 1, count: 1 },
  { id: "2side",    name: "2 Side by Side",  cols: 2, rows: 1, count: 2 },
  { id: "2stacked", name: "2 Stacked",       cols: 1, rows: 2, count: 2 },
  { id: "3stacked", name: "3 Stacked",       cols: 1, rows: 3, count: 3 },
  { id: "4grid",    name: "4 Grid",          cols: 2, rows: 2, count: 4 },
  { id: "3strip",   name: "3 Strip",         cols: 3, rows: 1, count: 3 },
];

// ─── Studio templates ─────────────────────────────────────────────────────────

export type TemplateId = "none" | "polaroid" | "film" | "vintage";

export const STUDIO_TEMPLATES: {
  id: TemplateId;
  name: string;
  description: string;
}[] = [
  { id: "none",     name: "None",     description: "Clean, no frame"       },
  { id: "polaroid", name: "Polaroid", description: "Classic white border"  },
  { id: "film",     name: "Film",     description: "Cinematic film strip"  },
  { id: "vintage",  name: "Vintage",  description: "Warm aged border"      },
];

// ─── Style packs ──────────────────────────────────────────────────────────────

const STYLE_PACKS = [
  { id: "minimal", name: "Minimal", color: "#7c3aed" },
  { id: "rose",    name: "Rose",    color: "#e11d48" },
  { id: "ocean",   name: "Ocean",   color: "#0891b2" },
  { id: "forest",  name: "Forest",  color: "#15803d" },
  { id: "golden",  name: "Golden",  color: "#d97706" },
  { id: "neon",    name: "Neon",    color: "#a855f7" },
];

// ─── Orchestrator ─────────────────────────────────────────────────────────────

interface Props {
  layout?: string;
}

export function StudioOrchestrator({ layout }: Props) {
  const [activeLayout, setActiveLayout] = useState<LayoutId>(
    (layout as LayoutId) in LAYOUT_MAP ? (layout as LayoutId) : "2side"
  );
  const { cols, rows, count } = LAYOUT_MAP[activeLayout];

  const [styleOpen, setStyleOpen] = useState(false);
  const [activePack, setActivePack] = useState("minimal");
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>("none");
  const [showResult, setShowResult] = useState(false);

  const { videoRef, capture } = useCamera();
  const { capturedFrames, clearFrames, cameraStatus, stream } = useCameraStore();

  // Clear stale frames from any previous session
  useEffect(() => {
    clearFrames();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleLayoutChange(id: LayoutId) {
    setActiveLayout(id);
    clearFrames();
  }

  const capturedCount = Math.min(capturedFrames.length, count);
  const isDone = capturedCount >= count;
  const stylePack = STYLE_PACKS.find((p) => p.id === activePack) ?? STYLE_PACKS[0];
  const isLive = cameraStatus === "active";

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">

      {/* ── 1. Fullscreen camera background ─────────────────────────── */}
      <StudioCamera
        videoRef={videoRef}
        cameraStatus={cameraStatus}
        onReload={() => window.location.reload()}
      />

      {/* ── 2. Floating top bar ──────────────────────────────────────── */}
      <StudioTopBar
        capturedCount={capturedCount}
        totalCount={count}
        drawerOpen={styleOpen}
        onToggleDrawer={() => setStyleOpen((v) => !v)}
        onReset={clearFrames}
      />

      {/* ── 3. Floating preview card (live camera in each slot) ──────── */}
      <AnimatePresence>
        {isLive && (
          <StudioPreviewCard
            cols={cols}
            rows={rows}
            count={count}
            capturedFrames={capturedFrames}
            stream={stream}
            stylePack={stylePack}
            templateId={activeTemplate}
          />
        )}
      </AnimatePresence>

      {/* ── 4. Floating capture controls ─────────────────────────────── */}
      <AnimatePresence>
        {isLive && (
          <StudioCaptureBar
            isDone={isDone}
            capturedFrames={capturedFrames}
            count={count}
            onCapture={capture}
            onRetake={clearFrames}
            onContinue={() => setShowResult(true)}
          />
        )}
      </AnimatePresence>

      {/* ── 5. Result screen — slides up after all shots taken ────────── */}
      <AnimatePresence>
        {showResult && (
          <StudioResultScreen
            cols={cols}
            rows={rows}
            count={count}
            capturedFrames={capturedFrames}
            templateId={activeTemplate}
            stylePack={stylePack}
            onBack={() => setShowResult(false)}
            onRetake={() => { setShowResult(false); clearFrames(); }}
          />
        )}
      </AnimatePresence>

      {/* ── 6. Collapsible style panel (drawer on desktop / sheet on mobile) */}
      <AnimatePresence>
        {styleOpen && (
          <StudioStylePanel
            packs={STYLE_PACKS}
            activePack={activePack}
            onSelect={setActivePack}
            layouts={LAYOUT_LIST}
            activeLayout={activeLayout}
            onLayoutChange={handleLayoutChange}
            templates={STUDIO_TEMPLATES}
            activeTemplate={activeTemplate}
            onTemplateChange={setActiveTemplate}
            onClose={() => setStyleOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
