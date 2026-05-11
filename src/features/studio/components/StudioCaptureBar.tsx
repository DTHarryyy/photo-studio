"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CapturedFrame } from "@/features/camera/types/camera.types";
import { useCameraStore } from "@/features/camera/store/camera.store";

interface Props {
  onCapture: () => void;
  onRetake: () => void;
  onContinue: () => void;
  isDone: boolean;
  capturedFrames: (CapturedFrame | null)[];
  count: number;
}

export function StudioCaptureBar({
  onCapture,
  onRetake,
  onContinue,
  isDone,
  capturedFrames,
  count,
}: Props) {
  const { toggleFacingMode } = useCameraStore();

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 pb-safe-bottom pb-8 sm:pb-10">

      {/* Captured thumbnails strip — only non-null frames */}
      {capturedFrames.some(Boolean) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          {capturedFrames.slice(0, count).map((frame, i) =>
            frame ? (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", delay: i * 0.05 }}
                className="relative h-14 w-14 overflow-hidden rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.6)] ring-1 ring-white/20"
              >
                <img
                  src={frame.dataUrl}
                  className="h-full w-full object-cover"
                  alt={`Capture ${i + 1}`}
                />
              </motion.div>
            ) : null
          )}
        </motion.div>
      )}

      {/* Controls row */}
      <div className="flex items-center gap-8">

        {/* Flip camera */}
        <motion.button
          whileTap={{ rotate: 180, scale: 0.9 }}
          onClick={toggleFacingMode}
          aria-label="Flip camera"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/60 backdrop-blur-xl transition-colors hover:border-white/25 hover:text-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20 7h-3.382l-1.724-3.447A1 1 0 0 0 14 3H10a1 1 0 0 0-.894.553L7.382 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-8 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
          </svg>
        </motion.button>

        {/* Main capture button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={isDone ? undefined : onCapture}
          disabled={isDone}
          aria-label={isDone ? "All photos taken" : "Capture photo"}
          className="relative flex h-[72px] w-[72px] items-center justify-center"
        >
          {/* Animated pulse ring */}
          {!isDone && (
            <span className="absolute inset-0 animate-capture-ring rounded-full border-2 border-white/30" />
          )}
          {/* Static outer ring */}
          <span className="absolute inset-0 rounded-full border-2 border-white/50" />
          {/* Button face */}
          <span
            className={cn(
              "h-[54px] w-[54px] rounded-full transition-all duration-200",
              isDone
                ? "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 shadow-[0_0_24px_rgba(139,92,246,0.6)]"
                : "bg-white shadow-[0_0_24px_rgba(255,255,255,0.5)]"
            )}
          />
          {isDone && (
            <svg
              className="absolute h-6 w-6 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </motion.button>

        {/* Continue / spacer */}
        {isDone ? (
          <motion.button
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
          className="flex h-12 items-center gap-1.5 rounded-full border border-violet-500/40 bg-violet-600/25 px-5 text-sm font-semibold text-white backdrop-blur-xl transition-all hover:bg-violet-600/40 hover:border-violet-500/60"
          >
            Continue
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
              <path d="M8.22 3.22a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06-1.06l2.72-2.72H1.75a.75.75 0 0 1 0-1.5H10.94L8.22 4.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </motion.button>
        ) : (
          <div className="h-12 w-12" aria-hidden />
        )}

      </div>
    </div>
  );
}
