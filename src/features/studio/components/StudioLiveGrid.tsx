"use client";

import { useState, useEffect, useRef, type RefObject, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CapturedFrame } from "@/features/camera/types/camera.types";
import type { CameraStatus } from "@/features/camera/store/camera.store";
import type { TemplateId } from "./StudioOrchestrator";
import { useCameraStore } from "@/features/camera/store/camera.store";

// Chrome heights to clear the top bar and capture bar
const TOP_CLEAR = 64;
const BOTTOM_CLEAR = 152;
const SLOT_GAP = 4;
const PAD = 20;

function computeSlotSize(cols: number, rows: number, templateId: TemplateId): number {
  if (typeof window === "undefined") return 160;

  const availH = window.innerHeight - TOP_CLEAR - BOTTOM_CLEAR - PAD * 2 - (rows - 1) * SLOT_GAP;
  const availW = window.innerWidth - PAD * 2 - (cols - 1) * SLOT_GAP;

  if (templateId === "film") {
    // Rails ≈ 14% of slotSize each side → total width = slotSize * (cols + 0.28) + gaps + rail padding
    const byW = Math.floor((availW - 12) / (cols + 0.28));
    const byH = Math.floor((availH - 28) / rows); // 28 for film footer
    return Math.max(80, Math.min(byW, byH, 340));
  }

  if (templateId === "polaroid") {
    const byW = Math.floor((availW - 32) / cols); // 16px side padding each side
    const byH = Math.floor((availH - 64) / rows); // 40px bottom label + 24px top pad
    return Math.max(80, Math.min(byW, byH, 340));
  }

  return Math.max(80, Math.min(
    Math.floor(availW / cols),
    Math.floor(availH / rows),
    340
  ));
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>;
  cols: number;
  rows: number;
  count: number;
  capturedFrames: (CapturedFrame | null)[];
  stream: MediaStream | null;
  cameraStatus: CameraStatus;
  templateId: TemplateId;
  photoFilter: string;
  onRetakeSlot: (i: number) => void;
  onReload: () => void;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function StudioLiveGrid({
  videoRef,
  cols, rows, count,
  capturedFrames,
  stream,
  cameraStatus,
  templateId,
  photoFilter,
  onRetakeSlot,
  onReload,
}: Props) {
  const [slotSize, setSlotSize] = useState(() => computeSlotSize(cols, rows, templateId));

  useEffect(() => {
    function update() { setSlotSize(computeSlotSize(cols, rows, templateId)); }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [cols, rows, templateId]);

  const S = slotSize / 120;
  const isFilm = templateId === "film";
  const isPolaroid = templateId === "polaroid";

  // ── Camera not yet active ─────────────────────────────────────────────────
  if (cameraStatus !== "active") {
    return (
      <div className="absolute inset-0 bg-zinc-950">
        {/* Hidden video — keeps useCamera hook happy */}
        <video ref={videoRef} autoPlay muted playsInline className="pointer-events-none absolute opacity-0" style={{ width: 1, height: 1 }} />

        {(cameraStatus === "idle" || cameraStatus === "requesting") && (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <svg className="h-7 w-7 animate-pulse text-zinc-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-2.5 2.5-1.97-1.97a1.5 1.5 0 0 0-2.12 0L3 16.06Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-300">
                {cameraStatus === "idle" ? "Initialising camera…" : "Allow camera access when prompted"}
              </p>
              <p className="mt-1 text-xs text-zinc-600">Your camera is needed to take photos</p>
            </div>
          </div>
        )}

        {cameraStatus === "denied" && (
          <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-900/30 bg-red-950/20">
              <svg className="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-white">Camera access denied</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Click the camera icon in your browser&apos;s address bar, allow access, then reload.
              </p>
            </div>
            <button onClick={onReload} className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-white/30 hover:text-white active:scale-95">
              Reload page
            </button>
          </div>
        )}

        {cameraStatus === "error" && (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="font-semibold text-white">Camera unavailable</p>
            <p className="text-sm text-zinc-500">No camera found or it&apos;s in use by another app.</p>
            <button onClick={onReload} className="mt-2 rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-white/30 hover:text-white active:scale-95">
              Reload page
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Active — build the layout grid ───────────────────────────────────────

  const grid = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${slotSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${slotSize}px)`,
        gap: SLOT_GAP,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <LiveSlot
          key={i}
          index={i}
          stream={stream}
          frame={capturedFrames[i] ?? null}
          photoFilter={photoFilter}
          templateId={templateId}
          slotSize={slotSize}
          onRetake={() => onRetakeSlot(i)}
        />
      ))}
    </div>
  );

  // ── Template chrome ───────────────────────────────────────────────────────

  let content: ReactNode;

  if (isPolaroid) {
    const pad = Math.round(12 * S);
    const pb = Math.round(40 * S);
    content = (
      <div
        style={{ background: "#fff", padding: pad, paddingBottom: pb, borderRadius: Math.round(2 * S) }}
        className="shadow-2xl"
      >
        <div style={{ overflow: "hidden" }}>{grid}</div>
      </div>
    );
  } else if (isFilm) {
    const RAIL_W = Math.round(slotSize * 0.14);
    const PAD_X = Math.round(6 * S);
    const FOOTER_H = Math.round(28 * S);
    const holeCount = rows * 5 + 2;
    content = (
      <div className="overflow-hidden rounded-sm shadow-2xl" style={{ background: "#000" }}>
        <div className="flex items-stretch">
          <FilmRail railW={RAIL_W} holeCount={holeCount} />
          <div style={{ padding: `${PAD_X}px`, paddingBottom: 0 }}>
            {grid}
            <div style={{ height: FOOTER_H, background: "#000" }} />
          </div>
          <FilmRail railW={RAIL_W} holeCount={holeCount} />
        </div>
      </div>
    );
  } else {
    content = (
      <div
        className="overflow-hidden rounded-2xl"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 32px 64px rgba(0,0,0,0.6)" }}
      >
        {grid}
      </div>
    );
  }

  return (
    <div
      className="absolute inset-x-0 flex items-center justify-center"
      style={{ top: TOP_CLEAR, bottom: BOTTOM_CLEAR }}
    >
      {/* Hidden video — receives the stream so useCamera capture() works */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="pointer-events-none absolute opacity-0"
        style={{ width: 1, height: 1 }}
      />
      {content}
    </div>
  );
}

// ─── Film sprocket rail ───────────────────────────────────────────────────────

function FilmRail({ railW, holeCount }: { railW: number; holeCount: number }) {
  const holeW = Math.round(railW * 0.55);
  const holeH = Math.round(holeW * 0.85);
  return (
    <div
      className="flex flex-col items-center justify-around"
      style={{ width: railW, background: "#000", padding: "6px 0" }}
    >
      {Array.from({ length: holeCount }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 rounded-sm"
          style={{ width: holeW, height: holeH, background: "rgba(255,255,255,0.85)" }}
        />
      ))}
    </div>
  );
}

// ─── Live slot ────────────────────────────────────────────────────────────────

function LiveSlot({
  index,
  stream,
  frame,
  photoFilter,
  templateId,
  slotSize,
  onRetake,
}: {
  index: number;
  stream: MediaStream | null;
  frame: CapturedFrame | null;
  photoFilter: string;
  templateId: TemplateId;
  slotSize: number;
  onRetake: () => void;
}) {
  const slotVideoRef = useRef<HTMLVideoElement | null>(null);
  const { facingMode } = useCameraStore();
  const mirror = facingMode === "user";
  const isFilm = templateId === "film";

  // If no custom filter is chosen, use the template default
  const filterCss = photoFilter || (isFilm ? "grayscale(1)" : undefined);
  const borderRadius = isFilm ? Math.round(slotSize * 0.1) : 0;

  useEffect(() => {
    const el = slotVideoRef.current;
    if (!el || frame) return;
    if (stream) {
      el.srcObject = stream;
      el.play().catch(() => {});
    }
  }, [stream, frame]);

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: slotSize, height: slotSize, borderRadius }}
    >
      {frame ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={frame.dataUrl}
          className="h-full w-full object-cover"
          style={{ filter: filterCss || undefined }}
          alt=""
        />
      ) : stream ? (
        <video
          ref={slotVideoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
          style={{
            transform: mirror ? "scaleX(-1)" : "none",
            filter: filterCss || undefined,
          }}
        />
      ) : (
        <div className="h-full w-full bg-zinc-900" />
      )}

      {/* Slot number — only on empty slots */}
      {!frame && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-semibold text-white/40 backdrop-blur-sm">
            {index + 1}
          </span>
        </div>
      )}

      {/* Retake button — only on captured slots */}
      <AnimatePresence>
        {frame && (
          <motion.button
            key="retake"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={onRetake}
            aria-label={`Retake photo ${index + 1}`}
            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/90"
          >
            ↺
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
