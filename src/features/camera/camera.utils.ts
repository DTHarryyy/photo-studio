import type { CapturedFrame } from "./types/camera.types";

export function frameToDataUrl(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): string {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d")?.drawImage(video, 0, 0);
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
