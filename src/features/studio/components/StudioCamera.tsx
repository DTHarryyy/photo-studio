"use client";

import type { RefObject } from "react";
import type { CameraStatus } from "@/features/camera/store/camera.store";
import { useCameraStore } from "@/features/camera/store/camera.store";

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraStatus: CameraStatus;
  onReload: () => void;
}

export function StudioCamera({ videoRef, cameraStatus, onReload }: Props) {
  const isActive = cameraStatus === "active";
  const { facingMode } = useCameraStore();
  const mirror = facingMode === "user";

  return (
    <>
      {/* Fullscreen camera feed — the entire background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300"
        style={{ transform: mirror ? "scaleX(-1)" : "none" }}
      />

      {/* Cinematic vignette overlays — only when live */}
      {isActive && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/20 to-transparent" />
        </div>
      )}

      {/* Requesting permission */}
      {(cameraStatus === "idle" || cameraStatus === "requesting") && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-950">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <svg
              className="h-7 w-7 animate-pulse text-zinc-500"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-2.5 2.5-1.97-1.97a1.5 1.5 0 0 0-2.12 0L3 16.06Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-300">
              {cameraStatus === "idle" ? "Initialising camera…" : "Allow camera access when prompted"}
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Your camera is needed to take photos
            </p>
          </div>
        </div>
      )}

      {/* Permission denied */}
      {cameraStatus === "denied" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-zinc-950 px-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-900/30 bg-red-950/20">
            <svg className="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-white">Camera access denied</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Click the camera icon in your browser&apos;s address bar, allow access, then reload.
            </p>
          </div>
          <button
            onClick={onReload}
            className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-white/30 hover:text-white active:scale-95"
          >
            Reload page
          </button>
        </div>
      )}

      {/* Hardware error */}
      {cameraStatus === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950 px-8 text-center">
          <p className="font-semibold text-white">Camera unavailable</p>
          <p className="text-sm text-zinc-500">
            No camera found or it&apos;s in use by another app.
          </p>
        </div>
      )}
    </>
  );
}
