import type { CanvasLayer } from "../types/canvas.types";

export function sortLayersByZIndex(layers: CanvasLayer[]): CanvasLayer[] {
  return [...layers].sort((a, b) => a.zIndex - b.zIndex);
}

export function composeLayers(
  ctx: CanvasRenderingContext2D,
  layers: CanvasLayer[],
  drawFn: (ctx: CanvasRenderingContext2D, layer: CanvasLayer) => void
): void {
  const sorted = sortLayersByZIndex(layers);
  for (const layer of sorted) {
    drawFn(ctx, layer);
  }
}
