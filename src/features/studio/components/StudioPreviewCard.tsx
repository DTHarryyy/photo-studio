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
  // Compute preview dimensions based on layout
  const BASE = 52; // px per slot unit
  const GAP = 2;
  const previewW = cols * BASE + (cols - 1) * GAP;
  const previewH = rows * BASE + (rows - 1) * GAP;

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
                gridTemplateColumns: `repeat(${cols}, ${BASE}px)`,
                gridTemplateRows: `repeat(${rows}, ${BASE}px)`,
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
                />
              ))}
            </div>
          </TemplateFrame>

          {/* Watermark */}
          <div
            className="px-2.5 py-1 text-right text-[8px] font-semibold"
            style={{ color: `${stylePack.color}80` }}
          >
            pitik.io
          </div>

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
      <div className="mx-1.5 mb-1.5 overflow-hidden rounded-lg bg-zinc-950">
        <SprocketRow />
        <div className="bg-zinc-900">{children}</div>
        <SprocketRow />
      </div>
    );
  }

  if (templateId === "vintage") {
    return (
      <div
        className="mx-1.5 mb-1.5 overflow-hidden rounded-sm p-1.5"
        style={{ background: "linear-gradient(145deg,#c9a882,#a17c5b)" }}
      >
        <div className="overflow-hidden rounded-[1px] ring-1 ring-black/10">
          {children}
        </div>
      </div>
    );
  }

  // none — default clean container
  return (
    <div className="mx-2 mb-2 overflow-hidden rounded-xl">{children}</div>
  );
}

function SprocketRow() {
  return (
    <div className="flex h-3 items-center justify-around bg-zinc-950 px-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-1.5 w-1 rounded-[1px] bg-zinc-800" />
      ))}
    </div>
  );
}

// ─── Live slot ────────────────────────────────────────────────────────────────

function LiveSlot({
  stream,
  frame,
  stylePack,
}: {
  stream: MediaStream | null;
  frame?: CapturedFrame;
  stylePack: StylePack;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { facingMode } = useCameraStore();
  const mirror = facingMode === "user";

  useEffect(() => {
    const el = videoRef.current;
    if (!el || frame) return;
    if (stream) {
      el.srcObject = stream;
      el.play().catch(() => {});
    }
  }, [stream, frame]);

  if (frame) {
    return (
      <img
        src={frame.dataUrl}
        className="h-full w-full object-cover"
        alt=""
      />
    );
  }

  if (stream) {
    return (
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="h-full w-full object-cover"
        style={{ transform: mirror ? "scaleX(-1)" : "none" }}
      />
    );
  }

  return (
    <div
      className="h-full w-full"
      style={{ backgroundColor: `${stylePack.color}18` }}
    />
  );
}
