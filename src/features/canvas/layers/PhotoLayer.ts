import type { PhotoLayer } from "../types/canvas.types";

const imageCache = new Map<string, HTMLImageElement>();

export function drawPhotoLayer(
  ctx: CanvasRenderingContext2D,
  layer: PhotoLayer
): void {
  if (!layer.visible) return;

  const cached = imageCache.get(layer.dataUrl);
  if (cached) {
    renderImage(ctx, cached, layer);
    return;
  }

  const img = new Image();
  img.onload = () => {
    imageCache.set(layer.dataUrl, img);
    renderImage(ctx, img, layer);
  };
  img.src = layer.dataUrl;
}

function renderImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  layer: PhotoLayer
): void {
  const { x, y, width, height } = layer.transform;
  ctx.drawImage(img, x, y, width, height);
}
