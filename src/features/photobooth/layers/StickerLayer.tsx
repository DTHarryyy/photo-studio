"use client";

import { useRef } from "react";
import { useLayerStore } from "../store/useLayerStore";
import type { UserLayer } from "../types/layer";

interface Props {
  layer: Extract<UserLayer, { type: "sticker" }>;
  containerSize: { w: number; h: number };
}

export function StickerLayer({ layer, containerSize }: Props) {
  const { selectedId, selectLayer, updateLayer, removeLayer } = useLayerStore();
  const isSelected = selectedId === layer.id;

  const left = (layer.x / 100) * containerSize.w;
  const top = (layer.y / 100) * containerSize.h;
  const displaySize = Math.max(24, (layer.size / 100) * containerSize.w);

  function onPointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    selectLayer(layer.id);

    const w = containerSize.w;
    const h = containerSize.h;
    const id = layer.id;
    const start = { clientX: e.clientX, clientY: e.clientY, x: layer.x, y: layer.y };

    function onMove(ev: PointerEvent) {
      const dx = ev.clientX - start.clientX;
      const dy = ev.clientY - start.clientY;
      const newX = Math.max(2, Math.min(98, start.x + (dx / w) * 100));
      const newY = Math.max(2, Math.min(98, start.y + (dy / h) * 100));
      updateLayer(id, { x: newX, y: newY });
    }

    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div
      onPointerDown={onPointerDown}
      style={{
        position: "absolute",
        left,
        top,
        width: displaySize,
        height: displaySize,
        transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        zIndex: layer.zIndex,
        outline: isSelected ? "2px dashed rgba(139,92,246,0.8)" : "none",
        outlineOffset: 3,
        borderRadius: 4,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={layer.src}
        alt={layer.name}
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      />

      {isSelected && (
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            padding: 0,
          }}
          aria-label="Remove sticker"
        >
          ×
        </button>
      )}
    </div>
  );
}
