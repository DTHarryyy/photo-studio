"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  capturedCount: number;
  totalCount: number;
  drawerOpen: boolean;
  onToggleDrawer: () => void;
  onReset: () => void;
}

export function StudioTopBar({
  capturedCount,
  totalCount,
  drawerOpen,
  onToggleDrawer,
  onReset,
}: Props) {
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-safe-top pt-4 sm:px-5">

      {/* Close */}
      <Link
        href="/booth"
        aria-label="Back to layouts"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-xl transition-all hover:border-white/30 hover:bg-black/60 hover:text-white active:scale-95"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M2 2l12 12M14 2L2 14" />
        </svg>
      </Link>

      {/* Centre pill — branding + progress */}
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-xl">
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-[9px] font-bold text-white shadow-[0_0_8px_rgba(139,92,246,0.5)]">
            C
          </div>
          <span className="text-xs font-semibold text-white">Chroniva</span>
        </div>

        <div className="h-3 w-px bg-white/15" />

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalCount }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "block rounded-full transition-all duration-300",
                i < capturedCount
                  ? "h-2 w-2 bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.7)]"
                  : "h-1.5 w-1.5 bg-white/25"
              )}
            />
          ))}
          <span className="ml-0.5 text-[11px] font-medium text-white/50">
            {capturedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">

        <button
          onClick={onReset}
          aria-label="Reset captures"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/60 backdrop-blur-xl transition-all hover:border-white/25 hover:bg-black/60 hover:text-white active:scale-95"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M1.5 8A6.5 6.5 0 1 0 4 3.5" />
            <path d="M1.5 3.5V8h4.5" />
          </svg>
        </button>

        <button
          onClick={onToggleDrawer}
          aria-label="Style options"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-xl transition-all active:scale-95",
            drawerOpen
              ? "border-violet-500/60 bg-violet-600/30 text-violet-300 shadow-[0_0_16px_rgba(139,92,246,0.3)]"
              : "border-white/15 bg-black/40 text-white/60 hover:border-white/25 hover:bg-black/60 hover:text-white"
          )}
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M14.5 1.5a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h3ZM6.75 1.5a1 1 0 0 1 1 1V6a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1h3ZM6.75 9a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h3Z" />
          </svg>
        </button>
      </div>

    </div>
  );
}
