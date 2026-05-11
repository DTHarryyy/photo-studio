import type { ExportConfig, ExportFormat } from "./types/export.types";

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  config: ExportConfig
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = formatToMime(config.format);
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null"));
      },
      mimeType,
      config.quality / 100
    );
  });
}

export function createObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function triggerDownload(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

function formatToMime(format: ExportFormat): string {
  const map: Record<ExportFormat, string> = {
    png: "image/png",
    jpeg: "image/jpeg",
    webp: "image/webp",
  };
  return map[format];
}
