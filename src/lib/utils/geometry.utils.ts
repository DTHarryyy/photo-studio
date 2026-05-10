export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function fitRect(src: Rect, dst: Rect): Rect {
  const srcAspect = src.width / src.height;
  const dstAspect = dst.width / dst.height;

  let width: number;
  let height: number;

  if (srcAspect > dstAspect) {
    width = dst.width;
    height = dst.width / srcAspect;
  } else {
    height = dst.height;
    width = dst.height * srcAspect;
  }

  return {
    x: dst.x + (dst.width - width) / 2,
    y: dst.y + (dst.height - height) / 2,
    width,
    height,
  };
}
