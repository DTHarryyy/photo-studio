"use client";

import { useCanvasStore } from "../store/canvas.store";
import { hitTest } from "../engine/hitTest";
import type { MouseEvent } from "react";

export function CanvasOverlay() {
  const { layers, selectLayer } = useCanvasStore();

  function handlePointerDown(e: MouseEvent<HTMLDivElement>) {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hit = hitTest(layers, x, y);
    selectLayer(hit?.id ?? null);
  }

  return (
    <div
      className="absolute inset-0 cursor-crosshair"
      onMouseDown={handlePointerDown}
    />
  );
}
