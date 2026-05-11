import type { CanvasLayer } from "../types/canvas.types";

export function hitTest(
  layers: CanvasLayer[],
  pointerX: number,
  pointerY: number
): CanvasLayer | null {
  // Iterate in reverse Z order — topmost layer wins
  const sorted = [...layers].sort((a, b) => b.zIndex - a.zIndex);
  for (const layer of sorted) {
    const { x, y, width, height } = layer.transform;
    if (
      pointerX >= x &&
      pointerX <= x + width &&
      pointerY >= y &&
      pointerY <= y + height
    ) {
      return layer;
    }
  }
  return null;
}
