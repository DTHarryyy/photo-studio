import type { FrameLayer } from "../types/canvas.types";

const frameCache = new Map<string, HTMLImageElement>();

export function drawFrameLayer(
  ctx: CanvasRenderingContext2D,
  layer: FrameLayer
): void {
  if (!layer.visible) return;

  const cached = frameCache.get(layer.src);
  if (cached) {
    draw(ctx, cached, layer);
    return;
  }

  const img = new Image();
  img.onload = () => {
    frameCache.set(layer.src, img);
    draw(ctx, img, layer);
  };
  img.src = layer.src;
}

function draw(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  layer: FrameLayer
): void {
  const { x, y, width, height } = layer.transform;
  ctx.drawImage(img, x, y, width, height);
}
