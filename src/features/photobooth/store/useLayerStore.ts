import { create } from "zustand";
import type { UserLayer, LayerPatch } from "../types/layer";

interface LayerState {
  layers: UserLayer[];
  selectedId: string | null;
  addSticker: (src: string, name: string) => void;
  addText: () => void;
  updateLayer: (id: string, patch: LayerPatch) => void;
  removeLayer: (id: string) => void;
  selectLayer: (id: string | null) => void;
  clearLayers: () => void;
}

export const useLayerStore = create<LayerState>()((set) => ({
  layers: [],
  selectedId: null,

  addSticker: (src, name) =>
    set((s) => {
      const id = crypto.randomUUID();
      return {
        layers: [
          ...s.layers,
          {
            id,
            type: "sticker" as const,
            src,
            name,
            x: 50,
            y: 40,
            size: 20,
            rotation: 0,
            zIndex: Date.now(),
          },
        ],
        selectedId: id,
      };
    }),

  addText: () =>
    set((s) => {
      const id = crypto.randomUUID();
      return {
        layers: [
          ...s.layers,
          {
            id,
            type: "text" as const,
            text: "Your text",
            x: 50,
            y: 60,
            fontSize: 7,
            fontFamily: "sans-serif",
            color: "#ffffff",
            zIndex: Date.now(),
          },
        ],
        selectedId: id,
      };
    }),

  updateLayer: (id, patch) =>
    set((s) => ({
      layers: s.layers.map((l) =>
        l.id === id ? ({ ...l, ...patch } as UserLayer) : l
      ),
    })),

  removeLayer: (id) =>
    set((s) => ({
      layers: s.layers.filter((l) => l.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),

  selectLayer: (id) => set({ selectedId: id }),

  clearLayers: () => set({ layers: [], selectedId: null }),
}));
