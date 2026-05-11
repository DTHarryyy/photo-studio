export interface CapturedFrame {
  id: string;
  dataUrl: string;
  width: number;
  height: number;
  capturedAt: number;
}

export type FacingMode = "user" | "environment";
