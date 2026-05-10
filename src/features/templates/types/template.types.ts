export interface SlotRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GridLayout {
  cols: number;
  rows: number;
  slots: SlotRect[];
}

export interface FrameStyle {
  borderRadius?: number;
  borderColor?: string;
  overlayAsset?: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  thumbnail: string;
  grid: GridLayout;
  frame: FrameStyle;
  aspectRatio: "1:1" | "4:3" | "3:4" | "16:9" | "9:16";
}
