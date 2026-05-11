export type StudioMode = "camera" | "canvas" | "templates" | "stickers" | "export";

export interface StudioSession {
  id: string;
  mode: StudioMode;
  createdAt: number;
}
