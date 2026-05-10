import type { TextLayer } from "../types/canvas.types";

export function drawTextLayer(
  ctx: CanvasRenderingContext2D,
  layer: TextLayer
): void {
  if (!layer.visible) return;

  const { x, y, width, height, rotation } = layer.transform;
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
  ctx.fillStyle = layer.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(layer.content, 0, 0);
  ctx.restore();
}
