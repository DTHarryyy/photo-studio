"use client";

import { useEffect, useRef } from "react";
import { useCanvasStore } from "../store/canvas.store";
import { clearCanvas } from "../engine/renderer";
import { composeLayers } from "../engine/compositor";
import { drawPhotoLayer } from "../layers/PhotoLayer";
import { drawStickerLayer } from "../layers/StickerLayer";
import { drawTextLayer } from "../layers/TextLayer";
import { drawFrameLayer } from "../layers/FrameLayer";
import type { CanvasLayer } from "../types/canvas.types";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { layers, viewport } = useCanvasStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    clearCanvas(ctx, viewport.width, viewport.height);
    composeLayers(ctx, layers, (c, layer) => dispatch(c, layer));
  }, [layers, viewport]);

  return { canvasRef };
}

function dispatch(ctx: CanvasRenderingContext2D, layer: CanvasLayer): void {
  switch (layer.type) {
    case "photo":
      drawPhotoLayer(ctx, layer);
      break;
    case "sticker":
      drawStickerLayer(ctx, layer);
      break;
    case "text":
      drawTextLayer(ctx, layer);
      break;
    case "frame":
      drawFrameLayer(ctx, layer);
      break;
  }
}
