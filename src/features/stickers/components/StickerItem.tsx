"use client";

import Image from "next/image";
import type { StickerDefinition } from "../types/sticker.types";

interface Props {
  sticker: StickerDefinition;
  onPlace: (id: string) => void;
}

export function StickerItem({ sticker, onPlace }: Props) {
  return (
    <button
      onClick={() => onPlace(sticker.id)}
      className="aspect-square relative rounded overflow-hidden bg-zinc-800 hover:bg-zinc-700 transition-colors"
      title={sticker.name}
    >
      <Image src={sticker.src} alt={sticker.name} fill className="object-contain p-1" />
    </button>
  );
}
