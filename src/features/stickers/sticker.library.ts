import type { StickerDefinition } from "./types/sticker.types";

export const STICKER_LIBRARY: StickerDefinition[] = [
  { id: "star-01", name: "Gold Star", src: "/assets/stickers/emoji/star-01.png", category: "emoji" },
  { id: "heart-01", name: "Heart", src: "/assets/stickers/emoji/heart-01.png", category: "emoji" },
  { id: "doodle-01", name: "Arrow", src: "/assets/stickers/doodles/doodle-01.png", category: "doodles" },
];

export function getStickersByCategory(category: string): StickerDefinition[] {
  return STICKER_LIBRARY.filter((s) => s.category === category);
}

export function getStickerById(id: string): StickerDefinition | undefined {
  return STICKER_LIBRARY.find((s) => s.id === id);
}

export const STICKER_CATEGORIES = [...new Set(STICKER_LIBRARY.map((s) => s.category))];
