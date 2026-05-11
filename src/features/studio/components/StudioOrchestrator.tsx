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

// ─── Layout config ────────────────────────────────────────────────────────────

const LAYOUT_MAP = {
  "1photo":   { cols: 1, rows: 1, count: 1 },
  "2side":    { cols: 2, rows: 1, count: 2 },
  "2stacked": { cols: 1, rows: 2, count: 2 },
  "3stacked": { cols: 1, rows: 3, count: 3 },
  "4grid":    { cols: 2, rows: 2, count: 4 },
  "3strip":   { cols: 3, rows: 1, count: 3 },
} as const;

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
  const layoutConfig =
    LAYOUT_MAP[layout as keyof typeof LAYOUT_MAP] ?? LAYOUT_MAP["2side"];
  const { cols, rows, count } = layoutConfig;

  const [styleOpen, setStyleOpen] = useState(false);
  const [activePack, setActivePack] = useState("minimal");

  const { videoRef, capture } = useCamera();
  const { capturedFrames, clearFrames, cameraStatus, stream } = useCameraStore();

  // Clear stale frames from any previous session
  useEffect(() => {
    clearFrames();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          />
        )}
      </AnimatePresence>

      {/* ── 5. Collapsible style panel (drawer on desktop / sheet on mobile) */}
      <AnimatePresence>
        {styleOpen && (
          <StudioStylePanel
            packs={STYLE_PACKS}
            activePack={activePack}
            onSelect={setActivePack}
            onClose={() => setStyleOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
