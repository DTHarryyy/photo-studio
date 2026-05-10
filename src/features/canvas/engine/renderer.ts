import type { CanvasLayer } from "../types/canvas.types";

export function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: CanvasLayer
): void {
  if (!layer.visible) return;

  ctx.save();
  const { x, y, width, height, rotation, scaleX, scaleY } = layer.transform;
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scaleX, scaleY);
  ctx.translate(-width / 2, -height / 2);

  // Dispatch to per-type draw — engine kept intentionally thin here
  // Each layer type will be handled by its own draw function in layers/
  ctx.restore();
}

export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
}
