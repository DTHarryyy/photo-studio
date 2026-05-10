import type { StickerLayer } from "../types/canvas.types";

const stickerCache = new Map<string, HTMLImageElement>();

export function drawStickerLayer(
  ctx: CanvasRenderingContext2D,
  layer: StickerLayer
): void {
  if (!layer.visible) return;

  const cached = stickerCache.get(layer.src);
  if (cached) {
    draw(ctx, cached, layer);
    return;
  }

  const img = new Image();
  img.onload = () => {
    stickerCache.set(layer.src, img);
    draw(ctx, img, layer);
  };
  img.src = layer.src;
}

function draw(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  layer: StickerLayer
): void {
  const { x, y, width, height, rotation } = layer.transform;
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(img, -width / 2, -height / 2, width, height);
  ctx.restore();
}
