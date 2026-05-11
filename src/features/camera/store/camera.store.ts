import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { CapturedFrame, FacingMode } from "../types/camera.types";

export type CameraStatus = "idle" | "requesting" | "active" | "denied" | "error";

interface CameraState {
  stream: MediaStream | null;
  facingMode: FacingMode;
  capturedFrames: (CapturedFrame | null)[];
  cameraStatus: CameraStatus;
  setStream: (stream: MediaStream | null) => void;
  toggleFacingMode: () => void;
  addFrame: (frame: CapturedFrame) => void;
  removeFrame: (index: number) => void;
  clearFrames: () => void;
  setCameraStatus: (status: CameraStatus) => void;
}

export const useCameraStore = create<CameraState>()(
  subscribeWithSelector((set) => ({
    stream: null,
    facingMode: "user",
    capturedFrames: [],
    cameraStatus: "idle",
    setStream: (stream) => set({ stream }),
    toggleFacingMode: () =>
      set((s) => ({ facingMode: s.facingMode === "user" ? "environment" : "user" })),
    addFrame: (frame) =>
      set((s) => {
        const frames = [...s.capturedFrames];
        const empty = frames.findIndex((f) => f === null);
        if (empty !== -1) {
          frames[empty] = frame;
        } else {
          frames.push(frame);
        }
        return { capturedFrames: frames };
      }),
    removeFrame: (index) =>
      set((s) => {
        const frames = [...s.capturedFrames];
        frames[index] = null;
        return { capturedFrames: frames };
      }),
    clearFrames: () => set({ capturedFrames: [] }),
    setCameraStatus: (cameraStatus) => set({ cameraStatus }),
  }))
);
