"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useCamera } from "@/features/camera/hooks/useCamera";
import { useCameraStore } from "@/features/camera/store/camera.store";
import { StudioCamera } from "./StudioCamera";
import { StudioTopBar } from "./StudioTopBar";
import { StudioCaptureBar } from "./StudioCaptureBar";
import { StudioStylePanel } from "./StudioStylePanel";
import { StudioResultScreen } from "./StudioResultScreen";
import { StudioEditScreen } from "./StudioEditScreen";
import { StudioLiveGrid } from "./StudioLiveGrid";
import { useLayerStore } from "@/features/photobooth/store/useLayerStore";

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

// ─── Templates ────────────────────────────────────────────────────────────────

export type TemplateId = "none" | "polaroid" | "film" | "instax" | "vintage" | "minimal" | "dark" | "scrapbook" | "neon" | "pastel" | "strip";

export const STUDIO_TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: "none",      name: "None",      description: "Clean, no frame"        },
  { id: "polaroid",  name: "Polaroid",  description: "Classic white border"   },
  { id: "film",      name: "Film",      description: "35mm film strip"        },
  { id: "instax",    name: "Instax",    description: "Fujifilm instant style" },
  { id: "vintage",   name: "Vintage",   description: "Aged photo border"      },
  { id: "minimal",   name: "Minimal",   description: "Clean gallery print"    },
  { id: "dark",      name: "Dark",      description: "Moody dark frame"       },
  { id: "scrapbook", name: "Scrapbook", description: "Kraft paper with tape"  },
  { id: "neon",      name: "Neon",      description: "Glowing neon border"    },
  { id: "pastel",    name: "Pastel",    description: "Soft & cute"            },
  { id: "strip",     name: "Strip",     description: "Classic booth printout" },
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

// ─── Phase type ───────────────────────────────────────────────────────────────

type Phase = "capture" | "edit" | "export";

// ─── Orchestrator ─────────────────────────────────────────────────────────────

interface Props {
  layout?: string;
}

export function StudioOrchestrator({ layout }: Props) {
  const [activeLayout, setActiveLayout] = useState<LayoutId>(
    (layout as LayoutId) in LAYOUT_MAP ? (layout as LayoutId) : "2side"
  );
  const { cols, rows, count } = LAYOUT_MAP[activeLayout];

  const [phase, setPhase] = useState<Phase>("capture");
  const [styleOpen, setStyleOpen] = useState(false);
  const [activePack, setActivePack] = useState("minimal");
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>("none");

  const { videoRef, capture } = useCamera();
  const { capturedFrames, clearFrames, removeFrame, cameraStatus, stream } = useCameraStore();
  const clearLayers = useLayerStore((s) => s.clearLayers);
  const photoFilter = useLayerStore((s) => s.photoFilter);
  const setPhotoFilter = useLayerStore((s) => s.setPhotoFilter);
  const photoBackground = useLayerStore((s) => s.photoBackground);
  const setPhotoBackground = useLayerStore((s) => s.setPhotoBackground);

  useEffect(() => {
    clearFrames();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleLayoutChange(id: LayoutId) {
    setActiveLayout(id);
    clearFrames();
    clearLayers();
  }

  function handleRetake() {
    clearFrames();
    clearLayers();
    setPhase("capture");
  }

  const capturedCount = capturedFrames.filter(Boolean).length;
  const isDone = capturedCount >= count;
  const stylePack = STYLE_PACKS.find((p) => p.id === activePack) ?? STYLE_PACKS[0];

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">

      {/* ── 1. Live grid — full-screen layout with live feed + captures ──── */}
      <StudioLiveGrid
        videoRef={videoRef}
        cols={cols}
        rows={rows}
        count={count}
        capturedFrames={capturedFrames}
        stream={stream}
        cameraStatus={cameraStatus}
        templateId={activeTemplate}
        photoFilter={photoFilter}
        photoBackground={photoBackground}
        onRetakeSlot={removeFrame}
        onReload={() => window.location.reload()}
      />

      {/* ── 2. Floating top bar ──────────────────────────────── */}
      <StudioTopBar
        capturedCount={capturedCount}
        totalCount={count}
        drawerOpen={styleOpen}
        onToggleDrawer={() => setStyleOpen((v) => !v)}
        onReset={clearFrames}
      />

      {/* ── 3. Capture controls ──────────────────────────────── */}
      <AnimatePresence>
        {cameraStatus === "active" && phase === "capture" && (
          <StudioCaptureBar
            isDone={isDone}
            onCapture={capture}
            onRetake={clearFrames}
            onContinue={() => setPhase("edit")}
          />
        )}
      </AnimatePresence>

      {/* ── 5. Edit screen ───────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "edit" && (
          <StudioEditScreen
            cols={cols}
            rows={rows}
            count={count}
            capturedFrames={capturedFrames}
            templateId={activeTemplate}
            stylePack={stylePack}
            onBack={() => setPhase("capture")}
            onDone={() => setPhase("export")}
          />
        )}
      </AnimatePresence>

      {/* ── 6. Export / result screen ────────────────────────────────── */}
      <AnimatePresence>
        {phase === "export" && (
          <StudioResultScreen
            cols={cols}
            rows={rows}
            count={count}
            capturedFrames={capturedFrames}
            templateId={activeTemplate}
            stylePack={stylePack}
            onBack={() => setPhase("edit")}
            onRetake={handleRetake}
          />
        )}
      </AnimatePresence>

      {/* ── 7. Style panel (capture phase only) ─────────────────────── */}
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
            activeFilter={photoFilter}
            onFilterChange={setPhotoFilter}
            activeBackground={photoBackground}
            onBackgroundChange={setPhotoBackground}
            onClose={() => setStyleOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
