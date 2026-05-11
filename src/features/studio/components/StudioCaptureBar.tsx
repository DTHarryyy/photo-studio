"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CapturedFrame } from "@/features/camera/types/camera.types";

interface Props {
  onCapture: () => void;
  onRetake: () => void;
  onContinue: () => void;
  isDone: boolean;
  capturedFrames: CapturedFrame[];
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
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 pb-safe-bottom pb-8 sm:pb-10">

      {/* Captured thumbnails strip */}
      {capturedFrames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          {capturedFrames.slice(0, count).map((frame, i) => (
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
          ))}
        </motion.div>
      )}

      {/* Controls row */}
      <div className="flex items-center gap-8">

        {/* Retake */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onRetake}
          aria-label="Retake all"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/60 backdrop-blur-xl transition-colors hover:border-white/25 hover:text-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
              clipRule="evenodd"
            />
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
