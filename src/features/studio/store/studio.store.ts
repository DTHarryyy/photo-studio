import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { StudioMode } from "../types/studio.types";

interface StudioState {
  mode: StudioMode;
  isSidebarOpen: boolean;
  setMode: (mode: StudioMode) => void;
  toggleSidebar: () => void;
}

export const useStudioStore = create<StudioState>()(
  subscribeWithSelector((set) => ({
    mode: "camera",
    isSidebarOpen: true,
    setMode: (mode) => set({ mode }),
    toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  }))
);
