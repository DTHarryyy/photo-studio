import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { CapturedFrame, FacingMode } from "../types/camera.types";

interface CameraState {
  stream: MediaStream | null;
  facingMode: FacingMode;
  capturedFrames: CapturedFrame[];
  setStream: (stream: MediaStream | null) => void;
  toggleFacingMode: () => void;
  addFrame: (frame: CapturedFrame) => void;
  clearFrames: () => void;
}

export const useCameraStore = create<CameraState>()(
  subscribeWithSelector((set) => ({
    stream: null,
    facingMode: "user",
    capturedFrames: [],
    setStream: (stream) => set({ stream }),
    toggleFacingMode: () =>
      set((s) => ({ facingMode: s.facingMode === "user" ? "environment" : "user" })),
    addFrame: (frame) =>
      set((s) => ({ capturedFrames: [...s.capturedFrames, frame] })),
    clearFrames: () => set({ capturedFrames: [] }),
  }))
);
