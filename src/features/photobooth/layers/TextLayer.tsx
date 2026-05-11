"use client";

import { useRef, useState } from "react";
import { useLayerStore } from "../store/useLayerStore";
import type { UserLayer } from "../types/layer";

interface Props {
  layer: Extract<UserLayer, { type: "text" }>;
  containerSize: { w: number; h: number };
}

export function TextLayer({ layer, containerSize }: Props) {
  const { selectedId, selectLayer, updateLayer, removeLayer } = useLayerStore();
  const isSelected = selectedId === layer.id;
  const [editing, setEditing] = useState(false);
  const hasDragged = useRef(false);

  const left = (layer.x / 100) * containerSize.w;
  const top = (layer.y / 100) * containerSize.h;
  const displayFontSize = Math.max(10, (layer.fontSize / 100) * containerSize.w);

  const sharedStyle: React.CSSProperties = {
    fontSize: displayFontSize,
    fontFamily: layer.fontFamily,
    color: layer.color,
    fontWeight: 700,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    textShadow: "0 1px 4px rgba(0,0,0,0.6)",
  };

  function onPointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    selectLayer(layer.id);
    hasDragged.current = false;

    const w = containerSize.w;
    const h = containerSize.h;
    const id = layer.id;
    const start = { clientX: e.clientX, clientY: e.clientY, x: layer.x, y: layer.y };

    function onMove(ev: PointerEvent) {
      const dx = ev.clientX - start.clientX;
      const dy = ev.clientY - start.clientY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged.current = true;
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

  function onDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!hasDragged.current) setEditing(true);
  }

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        zIndex: layer.zIndex,
        cursor: editing ? "text" : "grab",
        userSelect: "none",
        touchAction: "none",
        outline: isSelected && !editing ? "2px dashed rgba(139,92,246,0.8)" : "none",
        outlineOffset: 4,
        borderRadius: 4,
        padding: "2px 4px",
      }}
      onPointerDown={editing ? undefined : onPointerDown}
      onDoubleClick={onDoubleClick}
    >
      {editing ? (
        <input
          autoFocus
          value={layer.text}
          onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setEditing(false); }}
          style={{
            ...sharedStyle,
            background: "transparent",
            border: "none",
            outline: "2px solid rgba(139,92,246,0.8)",
            borderRadius: 4,
            padding: "0 2px",
            minWidth: 60,
            width: Math.max(60, layer.text.length * displayFontSize * 0.58 + 24),
            caretColor: layer.color,
            textShadow: "none",
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span style={sharedStyle}>{layer.text || "Your text"}</span>
      )}

      {isSelected && !editing && (
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
          aria-label="Remove text"
        >
          ×
        </button>
      )}
    </div>
  );
}
