"use client";

import { useState } from "react";
import { STICKER_CATEGORIES, getStickersByCategory } from "../sticker.library";
import { StickerItem } from "./StickerItem";
import { createStickerLayer } from "../sticker.engine";
import { useCanvasStore } from "@/features/canvas";
import { useStickerStore } from "../store/sticker.store";

export function StickerPicker() {
  const [activeCategory, setActiveCategory] = useState(STICKER_CATEGORIES[0]);
  const addLayer = useCanvasStore((s) => s.addLayer);
  const addPlacedSticker = useStickerStore((s) => s.addPlacedSticker);

  function handlePlace(stickerId: string) {
    const layer = createStickerLayer(stickerId);
    addLayer(layer);
    addPlacedSticker({ layerId: layer.id, stickerId });
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex gap-1 flex-wrap">
        {STICKER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2 py-1 text-xs rounded ${
              cat === activeCategory ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1">
        {getStickersByCategory(activeCategory).map((s) => (
          <StickerItem key={s.id} sticker={s} onPlace={handlePlace} />
        ))}
      </div>
    </div>
  );
}
