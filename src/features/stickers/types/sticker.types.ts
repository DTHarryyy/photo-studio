export interface StickerDefinition {
  id: string;
  name: string;
  src: string;
  category: string;
}

export interface PlacedSticker {
  layerId: string;
  stickerId: string;
}
