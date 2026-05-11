"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { CapturedFrame } from "@/features/camera/types/camera.types";
import type { TemplateId } from "./StudioOrchestrator";
import { useCameraStore } from "@/features/camera/store/camera.store";

export interface StylePack {
  id: string;
  name: string;
  color: string;
}

interface Props {
  cols: number;
  rows: number;
  count: number;
  capturedFrames: CapturedFrame[];
  stream: MediaStream | null;
  stylePack: StylePack;
  templateId: TemplateId;
}

export function StudioPreviewCard({
  cols,
  rows,
  count,
  capturedFrames,
  stream,
  stylePack,
  templateId,
}: Props) {
  // Film uses portrait slots to match the strip reference; others use square
  const isFilm = templateId === "film";
  const SLOT_W = isFilm ? 46 : 52;
  const SLOT_H = isFilm ? 46 : 52;
  const GAP = isFilm ? 5 : 2;
  const previewW = cols * SLOT_W + (cols - 1) * GAP;
  const previewH = rows * SLOT_H + (rows - 1) * GAP;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", delay: 0.4, damping: 22, stiffness: 260 }}
      className="absolute bottom-32 right-4 z-20 sm:bottom-36 sm:right-5"
    >
      {/* Outer glow ring matching style pack */}
      <div
        className="animate-float-b overflow-hidden rounded-2xl shadow-2xl"
        style={{
          boxShadow: `0 0 0 1px ${stylePack.color}35, 0 0 24px ${stylePack.color}25, 0 16px 48px rgba(0,0,0,0.7)`,
        }}
      >
        {/* Glass card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl">

          {/* Header */}
          <div className="flex items-center justify-between px-2.5 py-1.5">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-white/30">
              Preview
            </span>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: stylePack.color }}
            />
          </div>

          {/* Slot grid wrapped in template frame */}
          <TemplateFrame templateId={templateId} stylePack={stylePack}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, ${SLOT_W}px)`,
                gridTemplateRows: `repeat(${rows}, ${SLOT_H}px)`,
                gap: `${GAP}px`,
                width: previewW,
                height: previewH,
              }}
            >
              {Array.from({ length: count }).map((_, i) => (
                <LiveSlot
                  key={i}
                  stream={stream}
                  frame={capturedFrames[i]}
                  stylePack={stylePack}
                  templateId={templateId}
                />
              ))}
            </div>
          </TemplateFrame>


        </div>
      </div>
    </motion.div>
  );
}

// ─── Template frame ───────────────────────────────────────────────────────────

function TemplateFrame({
  templateId,
  stylePack,
  children,
}: {
  templateId: TemplateId;
  stylePack: StylePack;
  children: ReactNode;
}) {
  if (templateId === "polaroid") {
    return (
      <div className="mx-1.5 mb-1.5 overflow-hidden rounded-sm bg-white p-1.5 pb-6 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
        <div className="overflow-hidden">{children}</div>
      </div>
    );
  }

  if (templateId === "film") {
    return (
      <div className="mx-1 mb-1 overflow-hidden rounded-md" style={{ background: "#000" }}>
        <div className="flex items-stretch">
          <FilmSprocketRail />
          {/* Centre column: spaced photos + blank footer strip */}
          <div className="flex flex-col" style={{ padding: "10px 6px 0 6px" }}>
            {children}
            {/* Blank footer area */}
            <div style={{ height: 36, background: "#000" }} />
          </div>
          <FilmSprocketRail />
        </div>
      </div>
    );
  }

  // none — default clean container
  return (
    <div className="mx-2 mb-2 overflow-hidden rounded-xl">{children}</div>
  );
}

function FilmSprocketRail() {
  return (
    <div
      className="flex w-2 flex-col items-center justify-around py-1.5"
      style={{ background: "#000" }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 rounded-[1px]"
          style={{ width: 4, height: 5, background: "rgba(255,255,255,0.85)" }}
        />
      ))}
    </div>
  );
}

// ─── Live slot ────────────────────────────────────────────────────────────────

function LiveSlot({
  stream,
  frame,
  stylePack,
  templateId,
}: {
  stream: MediaStream | null;
  frame?: CapturedFrame;
  stylePack: StylePack;
  templateId: TemplateId;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { facingMode } = useCameraStore();
  const mirror = facingMode === "user";
  const grayscale = templateId === "film" ? "grayscale(1)" : undefined;

  useEffect(() => {
    const el = videoRef.current;
    if (!el || frame) return;
    if (stream) {
      el.srcObject = stream;
      el.play().catch(() => {});
    }
  }, [stream, frame]);

  const radius = templateId === "film" ? 7 : 0;

  const inner = frame ? (
    <img
      src={frame.dataUrl}
      className="h-full w-full object-cover"
      style={{ filter: grayscale }}
      alt=""
    />
  ) : stream ? (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="h-full w-full object-cover"
      style={{ transform: mirror ? "scaleX(-1)" : "none", filter: grayscale }}
    />
  ) : (
    <div className="h-full w-full" style={{ backgroundColor: `${stylePack.color}18` }} />
  );

  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{ borderRadius: radius }}
    >
      {inner}
    </div>
  );
}
