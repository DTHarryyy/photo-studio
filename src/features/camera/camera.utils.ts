import type { CapturedFrame } from "./types/camera.types";

export function frameToDataUrl(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  mirror = false
): string {
  const w = video.videoWidth;
  const h = video.videoHeight;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  if (mirror) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return canvas.toDataURL("image/png");
}

export function buildCapturedFrame(
  dataUrl: string,
  width: number,
  height: number
): CapturedFrame {
  return {
    id: crypto.randomUUID(),
    dataUrl,
    width,
    height,
    capturedAt: Date.now(),
  };
}
