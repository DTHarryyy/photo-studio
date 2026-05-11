"use client";

import { useCanvas } from "../hooks/useCanvas";
import { useCanvasStore } from "../store/canvas.store";

export function CanvasStage() {
  const { canvasRef } = useCanvas();
  const { viewport } = useCanvasStore();

  return (
    <canvas
      ref={canvasRef}
      width={viewport.width}
      height={viewport.height}
      className="max-h-full max-w-full object-contain"
    />
  );
}
