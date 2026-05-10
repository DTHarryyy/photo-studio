import { canvasToBlob, createObjectUrl } from "./export.utils";
import type { ExportConfig, ExportResult } from "./types/export.types";

export async function exportCanvas(
  canvas: HTMLCanvasElement,
  config: ExportConfig
): Promise<ExportResult> {
  const blob = await canvasToBlob(canvas, config);
  const url = createObjectUrl(blob);
  return { blob, url, format: config.format };
}
