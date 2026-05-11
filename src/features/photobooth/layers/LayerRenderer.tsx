"use client";

import { useRef, useState, useEffect, type RefObject } from "react";
import { useLayerStore } from "../store/useLayerStore";
import { StickerLayer } from "./StickerLayer";
import { TextLayer } from "./TextLayer";

interface Props {
  compositeRef: RefObject<HTMLElement | null>;
}

export function LayerRenderer({ compositeRef }: Props) {
  const layers = useLayerStore((s) => s.layers);
  const selectLayer = useLayerStore((s) => s.selectLayer);
  const [containerSize, setContainerSize] = useState({ w: 300, h: 300 });

  useEffect(() => {
    const el = compositeRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      setContainerSize({ w: rect.width, h: rect.height });
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [compositeRef]);

  if (layers.length === 0) return null;

  const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) selectLayer(null);
      }}
    >
      {sorted.map((layer) =>
        layer.type === "sticker" ? (
          <StickerLayer key={layer.id} layer={layer} containerSize={containerSize} />
        ) : (
          <TextLayer key={layer.id} layer={layer} containerSize={containerSize} />
        )
      )}
    </div>
  );
}
