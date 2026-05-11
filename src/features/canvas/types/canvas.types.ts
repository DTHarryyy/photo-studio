export type LayerType = "photo" | "sticker" | "text" | "frame";

export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export interface BaseLayer {
  id: string;
  type: LayerType;
  zIndex: number;
  visible: boolean;
  transform: Transform;
}

export interface PhotoLayer extends BaseLayer {
  type: "photo";
  dataUrl: string;
}

export interface StickerLayer extends BaseLayer {
  type: "sticker";
  stickerId: string;
  src: string;
}

export interface TextLayer extends BaseLayer {
  type: "text";
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
}

export interface FrameLayer extends BaseLayer {
  type: "frame";
  templateId: string;
  src: string;
}

export type CanvasLayer = PhotoLayer | StickerLayer | TextLayer | FrameLayer;

export interface Viewport {
  width: number;
  height: number;
}
