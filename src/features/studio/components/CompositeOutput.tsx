"use client";

import type { CapturedFrame } from "@/features/camera/types/camera.types";
import type { TemplateId } from "./StudioOrchestrator";

interface Props {
  cols: number;
  rows: number;
  count: number;
  capturedFrames: (CapturedFrame | null)[];
  templateId: TemplateId;
  /** Base slot size in px — all template chrome scales proportionally. Default 120. */
  slotSize?: number;
}

export function CompositeOutput({
  cols,
  rows,
  count,
  capturedFrames,
  templateId,
  slotSize = 120,
}: Props) {
  const S = slotSize / 120;
  const gap = Math.round(3 * S);
  const isFilm = templateId === "film";
  const grayscale = isFilm ? "grayscale(1)" : undefined;

  const grid = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${slotSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${slotSize}px)`,
        gap,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const frame = capturedFrames[i];
        return (
          <div
            key={i}
            style={{
              width: slotSize,
              height: slotSize,
              borderRadius: isFilm ? Math.round(14 * S) : 0,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {frame ? (
              <img
                src={frame.dataUrl}
                className="h-full w-full object-cover"
                style={{ filter: grayscale }}
                alt=""
              />
            ) : (
              <div className="h-full w-full bg-white/10" />
            )}
          </div>
        );
      })}
    </div>
  );

  if (templateId === "polaroid") {
    const pad = Math.round(12 * S);
    const pb = Math.round(40 * S);
    return (
      <div
        style={{ background: "#fff", padding: pad, paddingBottom: pb, borderRadius: Math.round(2 * S) }}
        className="shadow-2xl"
      >
        <div style={{ overflow: "hidden" }}>{grid}</div>
      </div>
    );
  }

  if (templateId === "film") {
    const railW = Math.round(22 * S);
    const holeW = Math.max(4, Math.round(11 * S));
    const holeH = Math.max(4, Math.round(11 * S));
    const pad = Math.round(14 * S);
    const footer = Math.round(72 * S);
    const holeCount = rows * 5 + 2;
    const holes = Array.from({ length: holeCount });

    const rail = (
      <div
        style={{
          width: railW,
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          paddingTop: Math.round(10 * S),
          paddingBottom: Math.round(10 * S),
        }}
      >
        {holes.map((_, i) => (
          <div
            key={i}
            style={{ width: holeW, height: holeH, borderRadius: Math.round(2 * S), background: "rgba(255,255,255,0.85)" }}
          />
        ))}
      </div>
    );

    return (
      <div
        className="overflow-hidden rounded-lg shadow-2xl"
        style={{ background: "#000", display: "flex", alignItems: "stretch" }}
      >
        {rail}
        <div style={{ display: "flex", flexDirection: "column", padding: `${pad}px ${pad}px 0 ${pad}px` }}>
          {grid}
          <div style={{ height: footer, background: "#000" }} />
        </div>
        {rail}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
      {grid}
    </div>
  );
}
