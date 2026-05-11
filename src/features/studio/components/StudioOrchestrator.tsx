"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCamera } from "@/features/camera/hooks/useCamera";
import { useCameraStore } from "@/features/camera/store/camera.store";
import { cn } from "@/lib/utils";

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
  { id: "minimal", name: "Minimal", color: "#7c3aed", slotBg: "#1a1228" },
  { id: "rose",    name: "Rose",    color: "#e11d48", slotBg: "#2d0a14" },
  { id: "ocean",   name: "Ocean",   color: "#0891b2", slotBg: "#04182a" },
  { id: "forest",  name: "Forest",  color: "#15803d", slotBg: "#071a0f" },
  { id: "golden",  name: "Golden",  color: "#d97706", slotBg: "#1c1200" },
  { id: "neon",    name: "Neon",    color: "#a855f7", slotBg: "#0f0020" },
];

// ─── Tab config ───────────────────────────────────────────────────────────────

type TabId = "style" | "layout" | "filter" | "stickers";
const TABS: { id: TabId; label: string }[] = [
  { id: "style",    label: "Style"    },
  { id: "layout",   label: "Layout"   },
  { id: "filter",   label: "Filter"   },
  { id: "stickers", label: "Stickers" },
];

// ─── Main orchestrator ────────────────────────────────────────────────────────

interface Props {
  layout?: string;
}

export function StudioOrchestrator({ layout }: Props) {
  const layoutConfig =
    LAYOUT_MAP[layout as keyof typeof LAYOUT_MAP] ?? LAYOUT_MAP["2side"];
  const { cols, rows, count } = layoutConfig;

  const [activeTab, setActiveTab]             = useState<TabId>("style");
  const [activeStylePack, setActiveStylePack] = useState("minimal");

  const { videoRef, capture } = useCamera();
  const { capturedFrames, clearFrames, cameraStatus } = useCameraStore();

  // Clear any leftover frames from a previous session on mount
  useEffect(() => { clearFrames(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const capturedCount = Math.min(capturedFrames.length, count);
  const isDone        = capturedCount >= count;
  const stylePack     = STYLE_PACKS.find((p) => p.id === activeStylePack) ?? STYLE_PACKS[0];
  const cameraReady   = cameraStatus === "active";
  const cameraBlocked = cameraStatus === "denied";
  const cameraFailed  = cameraStatus === "error";

  function handleCapture() {
    if (!isDone) capture();
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#0c0c14] text-white">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="flex h-12 flex-shrink-0 items-center justify-between border-b border-white/8 px-4">
        {/* Close */}
        <Link
          href="/"
          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/8 hover:text-white"
          aria-label="Exit studio"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d="M2 2l12 12M14 2L2 14" />
          </svg>
        </Link>

        {/* Logo + progress */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-[10px] font-bold">
              P
            </div>
            <span className="text-sm font-semibold text-white">Pitik Studio</span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                  i < capturedCount ? "bg-violet-400" : "bg-white/20"
                )}
              />
            ))}
            <span className="ml-1 text-xs text-zinc-500">
              {capturedCount}/{count}
            </span>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={clearFrames}
          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/8 hover:text-white"
          aria-label="Reset captures"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1.5 8A6.5 6.5 0 1 0 4 3.5" />
            <path d="M1.5 3.5V8h4.5" />
          </svg>
        </button>
      </header>

      {/* ── Body: 3 panels ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Camera panel */}
        <div className="relative flex w-80 flex-shrink-0 flex-col overflow-hidden border-r border-white/8">
          {/* Camera feed */}
          <div className="relative flex-1 overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />

            {/* Requesting permission overlay */}
            {(cameraStatus === "idle" || cameraStatus === "requesting") && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black">
                <svg className="h-8 w-8 animate-pulse text-zinc-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-2.5 2.5-1.97-1.97a1.5 1.5 0 0 0-2.12 0L3 16.06Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-zinc-500">
                  {cameraStatus === "idle" ? "Initialising…" : "Allow camera access when prompted"}
                </p>
              </div>
            )}

            {/* Permission denied overlay */}
            {cameraBlocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black px-5 text-center">
                <svg className="h-8 w-8 text-red-900" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-zinc-300">Camera access denied</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                    Click the camera icon in your browser&apos;s address bar and allow access, then reload.
                  </p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
                >
                  Reload page
                </button>
              </div>
            )}

            {/* Generic error overlay */}
            {cameraFailed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black px-5 text-center">
                <p className="text-sm font-semibold text-zinc-300">Camera unavailable</p>
                <p className="text-xs text-zinc-600">No camera was found or it&apos;s already in use.</p>
              </div>
            )}

            {/* Photo count badge */}
            {capturedCount > 0 && cameraReady && (
              <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                Photo {capturedCount} of {count}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {capturedFrames.length > 0 && (
            <div className="flex flex-shrink-0 gap-1.5 border-t border-white/8 bg-[#0c0c14] p-2">
              {capturedFrames.slice(0, count).map((frame) => (
                <img
                  key={frame.id}
                  src={frame.dataUrl}
                  alt="Captured"
                  className="h-9 w-9 rounded-md object-cover ring-1 ring-white/10"
                />
              ))}
            </div>
          )}

          {/* Capture button */}
          <div className="flex-shrink-0 p-3">
            <button
              onClick={handleCapture}
              disabled={isDone}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-white transition-all duration-200",
                isDone
                  ? "cursor-not-allowed bg-white/10 text-zinc-500"
                  : "bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
              )}
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
              {isDone ? "All Photos Taken" : "Capture Photo"}
            </button>
          </div>
        </div>

        {/* Center: Live preview */}
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-4 overflow-hidden p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Live Preview
          </p>

          {/* Preview canvas */}
          <div className="relative overflow-hidden rounded-2xl border border-white/8 shadow-[0_8px_48px_-8px_rgba(0,0,0,0.7)]"
            style={{ width: 290, height: 290 }}
          >
            {/* Slot grid */}
            <div
              className="h-full w-full"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: "3px",
                background: "#111",
              }}
            >
              {Array.from({ length: count }).map((_, i) => {
                const frame = capturedFrames[i];
                return frame ? (
                  <img
                    key={frame.id}
                    src={frame.dataUrl}
                    alt={`Slot ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center gap-1"
                    style={{ background: stylePack.slotBg }}
                  >
                    <svg
                      className="h-5 w-5 text-white/20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[10px] text-white/20">Slot {i + 1}</span>
                  </div>
                );
              })}
            </div>

            {/* Watermark */}
            <div className="pointer-events-none absolute bottom-1.5 right-2 text-[9px] font-medium text-white/15">
              pitik.io
            </div>
          </div>

          {/* Done CTA */}
          {isDone && (
            <button className="mt-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-[0_4px_24px_-4px_rgba(139,92,246,0.5)] transition-all hover:-translate-y-0.5 hover:brightness-110">
              Continue to Export →
            </button>
          )}
        </div>

        {/* Right: Tools panel */}
        <div className="flex w-60 flex-shrink-0 flex-col overflow-hidden border-l border-white/8">
          {/* Tabs */}
          <div className="flex flex-shrink-0 border-b border-white/8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 py-3 text-[11px] font-semibold transition-colors",
                  activeTab === tab.id
                    ? "border-b-2 border-violet-500 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === "style" && (
              <StyleTab
                packs={STYLE_PACKS}
                active={activeStylePack}
                onSelect={setActiveStylePack}
              />
            )}
            {activeTab === "layout" && (
              <PlaceholderTab label="Layout options coming soon" />
            )}
            {activeTab === "filter" && (
              <PlaceholderTab label="Photo filters coming soon" />
            )}
            {activeTab === "stickers" && (
              <PlaceholderTab label="Stickers coming soon" />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Style tab ────────────────────────────────────────────────────────────────

function StyleTab({
  packs,
  active,
  onSelect,
}: {
  packs: typeof STYLE_PACKS;
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        Style Packs
      </p>
      <div className="flex flex-col gap-0.5">
        {packs.map((pack) => (
          <button
            key={pack.id}
            onClick={() => onSelect(pack.id)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors",
              active === pack.id
                ? "bg-white/8 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            )}
          >
            {/* Color swatch */}
            <span
              className="h-6 w-6 flex-shrink-0 rounded-full ring-1 ring-white/10"
              style={{ background: pack.color }}
            />
            <span className="flex-1 text-sm font-medium">{pack.name}</span>
            {active === pack.id && (
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: pack.color }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Placeholder tab ──────────────────────────────────────────────────────────

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="flex h-32 items-center justify-center text-center">
      <p className="text-xs text-zinc-600">{label}</p>
    </div>
  );
}
