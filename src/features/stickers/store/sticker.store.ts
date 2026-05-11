import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { PlacedSticker } from "../types/sticker.types";

interface StickerState {
  placedStickers: PlacedSticker[];
  activeStickerId: string | null;
  addPlacedSticker: (entry: PlacedSticker) => void;
  removePlacedSticker: (layerId: string) => void;
  setActiveSticker: (id: string | null) => void;
}

export const useStickerStore = create<StickerState>()(
  subscribeWithSelector((set) => ({
    placedStickers: [],
    activeStickerId: null,
    addPlacedSticker: (entry) =>
      set((s) => ({ placedStickers: [...s.placedStickers, entry] })),
    removePlacedSticker: (layerId) =>
      set((s) => ({
        placedStickers: s.placedStickers.filter((p) => p.layerId !== layerId),
      })),
    setActiveSticker: (id) => set({ activeStickerId: id }),
  }))
);
