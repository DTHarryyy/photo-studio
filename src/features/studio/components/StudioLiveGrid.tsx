"use client";

import { useState, useEffect, useRef, type RefObject, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CapturedFrame } from "@/features/camera/types/camera.types";
import type { CameraStatus } from "@/features/camera/store/camera.store";
import type { TemplateId } from "./StudioOrchestrator";
import type { PhotoFilter } from "@/features/photobooth/store/useLayerStore";
import { useCameraStore } from "@/features/camera/store/camera.store";

const GRAIN_BG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

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
    const byW = Math.floor((availW - 32) / cols);
    const byH = Math.floor((availH - 64) / rows);
    return Math.max(80, Math.min(byW, byH, 340));
  }

  if (templateId === "instax") {
    const byW = Math.floor((availW - 24) / cols);
    const byH = Math.floor((availH - 100) / rows); // extra-wide bottom label
    return Math.max(80, Math.min(byW, byH, 340));
  }

  if (templateId === "strip") {
    const byW = Math.floor((availW - 24) / cols);
    const byH = Math.floor((availH - 90) / rows);
    return Math.max(80, Math.min(byW, byH, 340));
  }

  if (templateId === "vintage" || templateId === "minimal" || templateId === "dark" ||
      templateId === "scrapbook" || templateId === "neon" || templateId === "pastel") {
    const byW = Math.floor((availW - 32) / cols);
    const byH = Math.floor((availH - 32) / rows);
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
  photoFilter: PhotoFilter | null;
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
  const isFilm      = templateId === "film";
  const isPolaroid  = templateId === "polaroid";
  const isInstax    = templateId === "instax";
  const isVintage   = templateId === "vintage";
  const isMinimal   = templateId === "minimal";
  const isDark      = templateId === "dark";
  const isScrapbook = templateId === "scrapbook";
  const isNeon      = templateId === "neon";
  const isPastel    = templateId === "pastel";
  const isStrip     = templateId === "strip";

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
    const pb  = Math.round(48 * S);
    content = (
      <div style={{ background: "#FFFDF5", padding: pad, paddingBottom: pb, borderRadius: Math.round(3*S), boxShadow: "0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.1)" }}>
        <div style={{ overflow: "hidden", borderRadius: Math.round(1*S) }}>{grid}</div>
        <div style={{ height: 1, background: "rgba(0,0,0,0.06)", marginTop: Math.round(8*S) }} />
      </div>
    );
  } else if (isFilm) {
    const RAIL_W    = Math.round(slotSize * 0.14);
    const PAD_X     = Math.round(6 * S);
    const FOOTER_H  = Math.round(28 * S);
    const holeCount = rows * 5 + 2;
    const frameNums = Array.from({ length: cols }).map((_, c) => (
      <div key={c} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "rgba(220,110,0,0.7)", fontSize: Math.max(4, Math.round(5*S)), fontFamily: "monospace" }}>▪ {c+1}A ▪</span>
      </div>
    ));
    content = (
      <div className="overflow-hidden rounded-sm shadow-2xl" style={{ background: "#000" }}>
        <div style={{ height: Math.max(2, Math.round(3*S)), background: "rgba(210,100,0,0.55)" }} />
        <div className="flex items-stretch">
          <FilmRail railW={RAIL_W} holeCount={holeCount} />
          <div style={{ padding: `${PAD_X}px`, paddingBottom: 0 }}>
            {grid}
            <div style={{ height: FOOTER_H, background: "#000", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex" }}>{frameNums}</div>
            </div>
          </div>
          <FilmRail railW={RAIL_W} holeCount={holeCount} />
        </div>
        <div style={{ height: Math.max(2, Math.round(3*S)), background: "rgba(210,100,0,0.55)" }} />
      </div>
    );
  } else if (isInstax) {
    const pad = Math.round(10 * S);
    const pb  = Math.round(52 * S);
    content = (
      <div
        style={{ background: "#FAFAF8", padding: pad, paddingBottom: pb, borderRadius: Math.round(6 * S) }}
        className="shadow-2xl"
      >
        <div style={{ overflow: "hidden", borderRadius: Math.round(2 * S) }}>{grid}</div>
      </div>
    );
  } else if (isVintage) {
    const pad = Math.round(14 * S);
    const inner = Math.round(4 * S);
    content = (
      <div
        style={{ background: "#F5EDD6", padding: pad, borderRadius: Math.round(2 * S) }}
        className="shadow-2xl"
      >
        <div
          style={{
            border: `1px solid rgba(180,140,80,0.4)`,
            padding: inner,
            overflow: "hidden",
          }}
        >
          {grid}
        </div>
      </div>
    );
  } else if (isMinimal) {
    const pad = Math.round(12 * S);
    content = (
      <div
        style={{ background: "#fff", padding: pad }}
        className="shadow-2xl"
      >
        <div style={{ overflow: "hidden" }}>{grid}</div>
      </div>
    );
  } else if (isDark) {
    const pad = Math.round(12 * S);
    content = (
      <div
        style={{ background: "#111", padding: pad, borderRadius: Math.round(6 * S) }}
        className="shadow-2xl ring-1 ring-white/5"
      >
        <div style={{ overflow: "hidden", borderRadius: Math.round(3 * S) }}>{grid}</div>
      </div>
    );
  } else if (isScrapbook) {
    const outerPad = Math.round(14 * S);
    const innerPad = Math.round(6  * S);
    const tapeW    = Math.max(10, Math.round(16 * S));
    const tapeH    = Math.max(3,  Math.round(5  * S));
    const tb       = { position: "absolute" as const, width: tapeW, height: tapeH, background: "rgba(255,255,220,0.82)", zIndex: 2 };
    content = (
      <div style={{ background: "#C8956C", padding: outerPad, borderRadius: Math.round(4*S) }} className="shadow-2xl">
        <div className="relative" style={{ background: "#EED9B8", padding: innerPad }}>
          {grid}
          {Array.from({ length: count }).map((_, i) => {
            const col = i % cols, row = Math.floor(i / cols);
            const sx = innerPad + col * (slotSize + SLOT_GAP);
            const sy = innerPad + row * (slotSize + SLOT_GAP);
            return [
              <div key={`tl${i}`} style={{ ...tb, left: sx + slotSize*0.08, top: sy - tapeH/2, transform: "rotate(-7deg)" }} />,
              <div key={`tr${i}`} style={{ ...tb, left: sx + slotSize*0.72, top: sy - tapeH/2, transform: "rotate(7deg)" }} />,
              <div key={`bl${i}`} style={{ ...tb, left: sx + slotSize*0.08, top: sy + slotSize - tapeH/2, transform: "rotate(7deg)" }} />,
              <div key={`br${i}`} style={{ ...tb, left: sx + slotSize*0.72, top: sy + slotSize - tapeH/2, transform: "rotate(-7deg)" }} />,
            ];
          })}
        </div>
      </div>
    );
  } else if (isNeon) {
    const pad = Math.round(12 * S);
    content = (
      <div style={{ background: "#050508", padding: pad, borderRadius: Math.round(8*S) }} className="shadow-2xl">
        {grid}
      </div>
    );
  } else if (isPastel) {
    const pad  = Math.round(14 * S);
    const hr   = Math.max(8, Math.round(10 * S));
    const hs   = { position: "absolute" as const, color: "#D8A0C8", fontSize: hr, lineHeight: 1, opacity: 0.75 };
    content = (
      <div className="relative shadow-2xl" style={{ background: "#F0EBFF", padding: pad, borderRadius: Math.round(16*S) }}>
        <span style={{ ...hs, top: Math.round(4*S), left: Math.round(6*S) }}>♥</span>
        <span style={{ ...hs, top: Math.round(4*S), right: Math.round(6*S) }}>♥</span>
        <span style={{ ...hs, bottom: Math.round(4*S), left: Math.round(6*S) }}>♥</span>
        <span style={{ ...hs, bottom: Math.round(4*S), right: Math.round(6*S) }}>♥</span>
        <div style={{ overflow: "hidden", borderRadius: Math.round(8*S) }}>{grid}</div>
      </div>
    );
  } else if (isStrip) {
    const pad     = Math.round(10 * S);
    const headerH = Math.round(22 * S);
    const footerH = Math.round(18 * S);
    const date    = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    content = (
      <div style={{ background: "#fff", paddingLeft: pad, paddingRight: pad }} className="shadow-2xl">
        <div style={{ height: headerH, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #e5e5e5" }}>
          <span style={{ fontSize: Math.max(6, Math.round(7*S)), fontWeight: 700, letterSpacing: "0.14em", color: "#111", textTransform: "uppercase" as const }}>PHOTO BOOTH</span>
        </div>
        <div style={{ padding: `${pad}px 0` }}>{grid}</div>
        <div style={{ height: footerH, display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid #e5e5e5" }}>
          <span style={{ fontSize: Math.max(5, Math.round(6*S)), color: "#aaa", letterSpacing: "0.08em" }}>{date}</span>
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
  photoFilter: PhotoFilter | null;
  templateId: TemplateId;
  slotSize: number;
  onRetake: () => void;
}) {
  const slotVideoRef = useRef<HTMLVideoElement | null>(null);
  const { facingMode } = useCameraStore();
  const mirror  = facingMode === "user";
  const isFilm  = templateId === "film";
  const isNeonT = templateId === "neon";

  const filterCss  = photoFilter?.css || (isFilm ? "grayscale(1)" : undefined);
  const slotRadius = isFilm  ? Math.round(slotSize * 0.1)
    : isNeonT || templateId === "dark"   ? Math.round(slotSize * 0.033)
    : templateId === "pastel" || templateId === "instax" ? Math.round(slotSize * 0.017)
    : 0;

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
      className="relative"
      style={{
        width: slotSize,
        height: slotSize,
        ...(isNeonT ? {
          borderRadius: slotRadius,
          boxShadow: `0 0 ${Math.round(slotSize*0.08)}px rgba(168,85,247,0.7), 0 0 ${Math.round(slotSize*0.2)}px rgba(168,85,247,0.25)`,
        } : {}),
      }}
    >
      {/* Clipped content */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: slotRadius }}>
        {frame ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={frame.dataUrl} className="h-full w-full object-cover" style={{ filter: filterCss || undefined }} alt="" />
        ) : stream ? (
          <video ref={slotVideoRef} autoPlay muted playsInline className="h-full w-full object-cover" style={{ transform: mirror ? "scaleX(-1)" : "none", filter: filterCss || undefined }} />
        ) : (
          <div className="h-full w-full bg-zinc-900" />
        )}
        {photoFilter?.vignette && (
          <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${photoFilter.vignette}) 100%)` }} />
        )}
        {photoFilter?.grain && (
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: GRAIN_BG, backgroundRepeat: "repeat", backgroundSize: "150px 150px", mixBlendMode: "overlay", opacity: 0.25 }} />
        )}
        {!frame && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-semibold text-white/40 backdrop-blur-sm">{index + 1}</span>
          </div>
        )}
      </div>

      {/* Neon border ring — outside clip */}
      {isNeonT && (
        <div className="pointer-events-none absolute inset-0" style={{ borderRadius: slotRadius, border: "1px solid rgba(168,85,247,0.85)" }} />
      )}

      {/* Retake button — outside clip so it's always tappable */}
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
