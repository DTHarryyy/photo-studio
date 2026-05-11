import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { CanvasLayer, Viewport } from "../types/canvas.types";

interface CanvasState {
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  viewport: Viewport;
  addLayer: (layer: CanvasLayer) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, patch: Partial<CanvasLayer>) => void;
  selectLayer: (id: string | null) => void;
  reorderLayer: (id: string, newZIndex: number) => void;
  setViewport: (viewport: Viewport) => void;
}

export const useCanvasStore = create<CanvasState>()(
  subscribeWithSelector((set) => ({
    layers: [],
    selectedLayerId: null,
    viewport: { width: 1080, height: 1080 },
    addLayer: (layer) =>
      set((s) => ({ layers: [...s.layers, layer] })),
    removeLayer: (id) =>
      set((s) => ({ layers: s.layers.filter((l) => l.id !== id) })),
    updateLayer: (id, patch) =>
      set((s) => ({
        layers: s.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      })),
    selectLayer: (id) => set({ selectedLayerId: id }),
    reorderLayer: (id, newZIndex) =>
      set((s) => ({
        layers: s.layers.map((l) => (l.id === id ? { ...l, zIndex: newZIndex } : l)),
      })),
    setViewport: (viewport) => set({ viewport }),
  }))
);
