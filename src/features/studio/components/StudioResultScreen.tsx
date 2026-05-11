"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CapturedFrame } from "@/features/camera/types/camera.types";
import type { TemplateId } from "./StudioOrchestrator";
import type { StylePack } from "./StudioPreviewCard";

interface Props {
  cols: number;
  rows: number;
  count: number;
  capturedFrames: CapturedFrame[];
  templateId: TemplateId;
  stylePack: StylePack;
  onRetake: () => void;
  onBack: () => void;
}

// ─── Composite output rendered at display size ────────────────────────────────

const SLOT = 120;
const GAP = 3;

function CompositeOutput({
  cols,
  rows,
  count,
  capturedFrames,
  templateId,
  stylePack,
}: Omit<Props, "onRetake" | "onBack">) {
  const isFilm = templateId === "film";
  const slotW = SLOT;
  const slotH = SLOT;
  const grayscale = isFilm ? "grayscale(1)" : undefined;

  const grid = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${slotW}px)`,
        gridTemplateRows: `repeat(${rows}, ${slotH}px)`,
        gap: GAP,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const frame = capturedFrames[i];
        return (
          <div
            key={i}
            style={{
              width: slotW,
              height: slotH,
              borderRadius: isFilm ? 14 : 0,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {frame ? (
              <img
                src={frame.dataUrl}
                className="h-full w-full object-cover"
                style={{ filter: grayscale }}
                alt=""
              />
            ) : (
              <div className="h-full w-full bg-white/5" />
            )}
          </div>
        );
      })}
    </div>
  );

  if (templateId === "polaroid") {
    return (
      <div className="rounded-sm bg-white p-3 pb-10 shadow-2xl">
        <div className="overflow-hidden">{grid}</div>
      </div>
    );
  }

  if (templateId === "film") {
    const railW = 22;
    const holeW = 10;
    const holeH = 13;
    const holeCount = rows * 5 + 2;
    const holes = Array.from({ length: holeCount });

    return (
      <div
        className="overflow-hidden rounded-lg shadow-2xl"
        style={{ background: "#000", display: "flex", alignItems: "stretch" }}
      >
        {/* Left rail */}
        <div
          style={{
            width: railW,
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          {holes.map((_, i) => (
            <div
              key={i}
              style={{
                width: holeW,
                height: holeH,
                borderRadius: 2,
                background: "rgba(255,255,255,0.85)",
              }}
            />
          ))}
        </div>

        {/* Photos + blank footer area */}
        <div style={{ display: "flex", flexDirection: "column", padding: "14px 10px 0 10px" }}>
          {grid}
          <div style={{ height: 90, background: "#000" }} />
        </div>

        {/* Right rail */}
        <div
          style={{
            width: railW,
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          {holes.map((_, i) => (
            <div
              key={i}
              style={{
                width: holeW,
                height: holeH,
                borderRadius: 2,
                background: "rgba(255,255,255,0.85)",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
      {grid}
    </div>
  );
}

// ─── Canvas object-cover helper ──────────────────────────────────────────────
// Mirrors CSS object-fit:cover — crops from center to fill the target rect
// without any stretching.

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const srcAR = img.naturalWidth / img.naturalHeight;
  const dstAR = dw / dh;

  let sx: number, sy: number, sw: number, sh: number;

  if (srcAR > dstAR) {
    // Source wider than dest — crop left/right
    sh = img.naturalHeight;
    sw = sh * dstAR;
    sx = (img.naturalWidth - sw) / 2;
    sy = 0;
  } else {
    // Source taller than dest — crop top/bottom
    sw = img.naturalWidth;
    sh = sw / dstAR;
    sx = 0;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

// ─── Download helper ──────────────────────────────────────────────────────────

async function downloadComposite(
  capturedFrames: CapturedFrame[],
  cols: number,
  rows: number,
  templateId: TemplateId
) {
  const isFilm = templateId === "film";
  const isPolaroid = templateId === "polaroid";

  const SLOT_W = 400;
  const SLOT_H = 400;
  const GAP = 4;

  const RAIL = isFilm ? 56 : 0;
  const padX = isPolaroid ? 24 : isFilm ? 16 : 0;
  const padY = isPolaroid ? 24 : isFilm ? 20 : 0;
  const bottomPad = isPolaroid ? 100 : isFilm ? 200 : 0;
  const photoGap = isFilm ? 12 : GAP;

  const photoW = cols * SLOT_W + (cols - 1) * photoGap;
  const photoH = rows * SLOT_H + (rows - 1) * photoGap;
  const w = photoW + padX * 2 + RAIL * 2;
  const h = photoH + padY + bottomPad;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = isPolaroid ? "#fff" : "#000";
  ctx.fillRect(0, 0, w, h);

  // Film sprocket rails
  if (isFilm) {
    const HOLE_W = 32;
    const HOLE_H = 44;
    const holeCount = rows * 5 + 2;
    const spacing = h / (holeCount + 1);
    const drawRail = (railX: number) => {
      for (let i = 1; i <= holeCount; i++) {
        const hx = railX + (RAIL - HOLE_W) / 2;
        const hy = i * spacing - HOLE_H / 2;
        ctx.beginPath();
        ctx.roundRect(hx, hy, HOLE_W, HOLE_H, 4);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
      }
    };
    drawRail(0);
    drawRail(w - RAIL);
  }

  // Draw photos
  await Promise.all(
    capturedFrames.slice(0, cols * rows).map((frame, i) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = RAIL + padX + col * (SLOT_W + photoGap);
          const y = padY + row * (SLOT_H + photoGap);
          if (isFilm) {
            ctx.filter = "grayscale(1)";
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, SLOT_W, SLOT_H, 22);
            ctx.clip();
          }
          drawImageCover(ctx, img, x, y, SLOT_W, SLOT_H);
          if (isFilm) { ctx.restore(); ctx.filter = "none"; }
          resolve();
        };
        img.src = frame.dataUrl;
      })
    )
  );

  const link = document.createElement("a");
  link.download = "pitik-booth.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// ─── Result screen ────────────────────────────────────────────────────────────

export function StudioResultScreen({
  cols,
  rows,
  count,
  capturedFrames,
  templateId,
  stylePack,
  onRetake,
  onBack,
}: Props) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    await downloadComposite(capturedFrames, cols, rows, templateId);
    setDownloading(false);
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Pitik Photo Booth", text: "Created with pitik.io" });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#0a0a12]"
    >
      {/* Top bar */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/8 px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M3.22 6.22a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L5.06 7l3.47-3.47a.75.75 0 0 0-1.06-1.06L3.22 6.22Z" />
          </svg>
          Edit
        </button>

        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-[9px] font-bold text-white">
            P
          </div>
          <span className="text-sm font-semibold text-white">Your Shot</span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-white/10"
        >
          {copied ? (
            "Copied!"
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M11.5 1a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM4.5 6a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM11.5 10a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM5.44 10.22l5.13 2.56m-5.13-5.56 5.13-2.56" />
              </svg>
              Share
            </>
          )}
        </button>
      </div>

      {/* Composite preview */}
      <div className="flex flex-1 items-center justify-center overflow-hidden p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", damping: 22 }}
        >
          <CompositeOutput
            cols={cols}
            rows={rows}
            count={count}
            capturedFrames={capturedFrames}
            templateId={templateId}
            stylePack={stylePack}
          />
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 flex-col gap-2.5 border-t border-white/8 px-5 pb-safe-bottom pb-8 pt-4">
        {/* Primary — download */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          disabled={downloading}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white transition-all",
            downloading
              ? "bg-white/10 text-zinc-500"
              : "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 shadow-[0_4px_24px_-4px_rgba(139,92,246,0.5)] hover:brightness-110"
          )}
        >
          {downloading ? (
            "Saving…"
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M7.47 11.78a.75.75 0 0 0 1.06 0l3.75-3.75a.75.75 0 0 0-1.06-1.06L8.75 9.44V2.75a.75.75 0 0 0-1.5 0v6.69L4.78 6.97a.75.75 0 0 0-1.06 1.06l3.75 3.75Z" />
                <path d="M2.5 13.25a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5a.75.75 0 0 1-.75-.75Z" />
              </svg>
              Save Photo
            </>
          )}
        </motion.button>

        {/* Secondary row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="grid grid-cols-2 gap-2.5"
        >
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 py-3 text-sm font-medium text-zinc-300 transition-all hover:bg-white/10 hover:text-white active:scale-95"
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <path d="M5.44 10.22 10.56 12.78M10.56 3.22 5.44 5.78M13.5 2.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM6.5 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM13.5 13.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
            </svg>
            Share
          </button>

          <button
            onClick={onRetake}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-sm font-medium text-zinc-500 transition-all hover:border-white/20 hover:text-zinc-300 active:scale-95"
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z" clipRule="evenodd" />
            </svg>
            Retake
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
