import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { ExportStatus } from "../types/export.types";

interface ExportState {
  status: ExportStatus;
  progress: number;
  outputUrl: string | null;
  setStatus: (status: ExportStatus) => void;
  setProgress: (progress: number) => void;
  setOutputUrl: (url: string | null) => void;
  reset: () => void;
}

export const useExportStore = create<ExportState>()(
  subscribeWithSelector((set) => ({
    status: "idle",
    progress: 0,
    outputUrl: null,
    setStatus: (status) => set({ status }),
    setProgress: (progress) => set({ progress }),
    setOutputUrl: (outputUrl) => set({ outputUrl }),
    reset: () => set({ status: "idle", progress: 0, outputUrl: null }),
  }))
);
