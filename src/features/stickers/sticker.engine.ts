import { getStickerById } from "./sticker.library";
import type { StickerLayer } from "@/features/canvas";

const DEFAULT_SIZE = 120;

export function createStickerLayer(
  stickerId: string,
  x = 100,
  y = 100
): StickerLayer {
  const sticker = getStickerById(stickerId);
  if (!sticker) throw new Error(`Sticker "${stickerId}" not found`);

  return {
    id: crypto.randomUUID(),
    type: "sticker",
    stickerId,
    src: sticker.src,
    zIndex: Date.now(),
    visible: true,
    transform: {
      x,
      y,
      width: DEFAULT_SIZE,
      height: DEFAULT_SIZE,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    },
  };
}
