"use client";

import type { CapturedFrame } from "@/features/camera/types/camera.types";
import type { TemplateId } from "./StudioOrchestrator";
import type { PhotoFilter } from "@/features/photobooth/store/useLayerStore";

const GRAIN_BG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface Props {
  cols: number;
  rows: number;
  count: number;
  capturedFrames: (CapturedFrame | null)[];
  templateId: TemplateId;
  /** Base slot size in px — all template chrome scales proportionally. Default 120. */
  slotSize?: number;
  photoFilter?: PhotoFilter | null;
  photoBackground?: string | null;
  printTitle?: string;
  printDate?: string;
}

// ─── Print text footer ────────────────────────────────────────────────────────

function PrintTextBlock({
  title,
  date,
  S,
  titleColor,
  dateColor,
}: {
  title: string;
  date: string;
  S: number;
  titleColor: string;
  dateColor: string;
}) {
  if (!title && !date) return null;
  return (
    <div
      style={{
        textAlign: "center",
        padding: `${Math.max(4, Math.round(5 * S))}px ${Math.round(6 * S)}px ${Math.max(5, Math.round(6 * S))}px`,
      }}
    >
      {title && (
        <p
          style={{
            margin: 0,
            fontSize: Math.max(6, Math.round(7 * S)),
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: titleColor,
          }}
        >
          {title}
        </p>
      )}
      {date && (
        <p
          style={{
            margin: 0,
            marginTop: Math.max(1, Math.round(2 * S)),
            fontSize: Math.max(5, Math.round(5 * S)),
            letterSpacing: "0.07em",
            color: dateColor,
          }}
        >
          {date}
        </p>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CompositeOutput({
  cols,
  rows,
  count,
  capturedFrames,
  templateId,
  slotSize = 120,
  photoFilter,
  photoBackground,
  printTitle = "",
  printDate = "",
}: Props) {
  const S = slotSize / 120;
  const gap = Math.round(3 * S);
  const isFilm = templateId === "film";
  const imageFilter = photoFilter !== undefined
    ? (photoFilter?.css || undefined)
    : (isFilm ? "grayscale(1)" : undefined);

  const isNeon = templateId === "neon";

  const bgStyle = photoBackground
    ? { backgroundImage: `url(${photoBackground})`, backgroundSize: "cover" as const, backgroundPosition: "center" as const }
    : {};

  const slotRadius =
    isFilm   ? Math.round(14 * S) :
    isNeon   ? Math.round(4  * S) :
    templateId === "dark"   ? Math.round(4  * S) :
    templateId === "pastel" ? Math.round(3  * S) :
    templateId === "instax" ? Math.round(2  * S) :
    0;

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
            className="relative"
            style={{
              width: slotSize,
              height: slotSize,
              flexShrink: 0,
              ...(isNeon ? {
                borderRadius: slotRadius,
                boxShadow: `0 0 ${Math.round(10*S)}px rgba(168,85,247,0.7), 0 0 ${Math.round(26*S)}px rgba(168,85,247,0.25)`,
              } : {}),
            }}
          >
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: slotRadius }}>
              {frame ? (
                <img
                  src={frame.dataUrl}
                  className="h-full w-full object-cover"
                  style={{ filter: imageFilter }}
                  alt=""
                />
              ) : (
                <div className="h-full w-full bg-white/10" />
              )}
              {photoFilter?.vignette && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${photoFilter.vignette}) 100%)` }}
                />
              )}
              {photoFilter?.grain && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ backgroundImage: GRAIN_BG, backgroundRepeat: "repeat", backgroundSize: "150px 150px", mixBlendMode: "overlay", opacity: 0.25 }}
                />
              )}
            </div>
            {isNeon && (
              <div className="pointer-events-none absolute inset-0" style={{ borderRadius: slotRadius, border: "1px solid rgba(168,85,247,0.85)" }} />
            )}
          </div>
        );
      })}
    </div>
  );

  // Wraps any template node with an optional print text footer below it
  const withText = (
    node: React.ReactNode,
    titleColor: string,
    dateColor: string,
  ): React.ReactNode => {
    if (!printTitle && !printDate) return node;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        {node}
        <PrintTextBlock title={printTitle} date={printDate} S={S} titleColor={titleColor} dateColor={dateColor} />
      </div>
    );
  };

  // ── Templates ───────────────────────────────────────────────────────────────

  if (templateId === "polaroid") {
    const pad = Math.round(12 * S);
    const pb  = Math.round(48 * S);
    return withText(
      <div
        style={{ background: "#FFFDF5", ...bgStyle, padding: pad, paddingBottom: pb, borderRadius: Math.round(3 * S), boxShadow: "0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <div style={{ overflow: "hidden", borderRadius: Math.round(1 * S) }}>{grid}</div>
        <div style={{ height: 1, background: "rgba(0,0,0,0.06)", marginTop: Math.round(8 * S) }} />
      </div>,
      "#777777",
      "#aaaaaa",
    ) as React.ReactElement;
  }

  if (templateId === "film") {
    const railW     = Math.round(22 * S);
    const holeW     = Math.max(4, Math.round(11 * S));
    const holeH     = Math.max(4, Math.round(11 * S));
    const pad       = Math.round(14 * S);
    const footer    = Math.round(72 * S);
    const holeCount = rows * 5 + 2;
    const holes     = Array.from({ length: holeCount });

    const rail = (
      <div style={{ width: railW, background: "#0A0800", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", paddingTop: Math.round(10*S), paddingBottom: Math.round(10*S) }}>
        {holes.map((_, i) => (
          <div key={i} style={{ width: holeW, height: holeH, borderRadius: Math.round(2*S), background: "rgba(255,255,255,0.88)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)" }} />
        ))}
      </div>
    );

    const frameNums = Array.from({ length: cols }).map((_, c) => (
      <div key={c} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "rgba(220,110,0,0.7)", fontSize: Math.max(5, Math.round(6*S)), fontFamily: "monospace", letterSpacing: "0.05em" }}>▪ {c+1}A ▪</span>
      </div>
    ));

    return withText(
      <div className="overflow-hidden rounded-sm shadow-2xl" style={{ background: "#000", ...bgStyle }}>
        <div style={{ height: Math.max(2, Math.round(3*S)), background: "rgba(210,100,0,0.55)" }} />
        <div className="flex items-stretch">
          {rail}
          <div style={{ display: "flex", flexDirection: "column", padding: `${pad}px ${pad}px 0 ${pad}px` }}>
            {grid}
            <div style={{ height: footer, background: "#000", display: "flex", flexDirection: "column", justifyContent: "center", gap: Math.round(4*S) }}>
              <div style={{ display: "flex" }}>{frameNums}</div>
              <p style={{ textAlign: "center", color: "rgba(200,100,0,0.45)", fontSize: Math.max(4, Math.round(5*S)), fontFamily: "monospace", margin: 0 }}>KODAK 400 ■ ■ ■</p>
            </div>
          </div>
          {rail}
        </div>
        <div style={{ height: Math.max(2, Math.round(3*S)), background: "rgba(210,100,0,0.55)" }} />
      </div>,
      "rgba(210,110,0,0.8)",
      "rgba(180,90,0,0.5)",
    ) as React.ReactElement;
  }

  if (templateId === "instax") {
    const pad = Math.round(10 * S);
    const pb  = Math.round(52 * S);
    return withText(
      <div
        style={{ background: "#FAFAF8", ...bgStyle, padding: pad, paddingBottom: pb, borderRadius: Math.round(6 * S) }}
        className="shadow-2xl"
      >
        <div style={{ overflow: "hidden", borderRadius: Math.round(2 * S) }}>{grid}</div>
      </div>,
      "#888888",
      "#bbbbbb",
    ) as React.ReactElement;
  }

  if (templateId === "vintage") {
    const pad   = Math.round(14 * S);
    const inner = Math.round(4 * S);
    return withText(
      <div
        style={{ background: "#F5EDD6", ...bgStyle, padding: pad, borderRadius: Math.round(2 * S) }}
        className="shadow-2xl"
      >
        <div style={{ border: "1px solid rgba(180,140,80,0.4)", padding: inner, overflow: "hidden" }}>
          {grid}
        </div>
      </div>,
      "#6B4F2A",
      "#A08050",
    ) as React.ReactElement;
  }

  if (templateId === "minimal") {
    const pad = Math.round(12 * S);
    return withText(
      <div style={{ background: "#fff", ...bgStyle, padding: pad }} className="shadow-2xl">
        <div style={{ overflow: "hidden" }}>{grid}</div>
      </div>,
      "#444444",
      "#999999",
    ) as React.ReactElement;
  }

  if (templateId === "dark") {
    const pad = Math.round(12 * S);
    return withText(
      <div
        style={{ background: "#111", ...bgStyle, padding: pad, borderRadius: Math.round(6 * S) }}
        className="shadow-2xl ring-1 ring-white/5"
      >
        <div style={{ overflow: "hidden", borderRadius: Math.round(3 * S) }}>{grid}</div>
      </div>,
      "#cccccc",
      "#777777",
    ) as React.ReactElement;
  }

  if (templateId === "scrapbook") {
    const outerPad = Math.round(16 * S);
    const innerPad = Math.round(8  * S);
    const tapeW    = Math.max(12, Math.round(20 * S));
    const tapeH    = Math.max(4,  Math.round(6  * S));
    const tapeBase = { position: "absolute" as const, width: tapeW, height: tapeH, background: "rgba(255,255,220,0.82)", zIndex: 2 };
    return withText(
      <div style={{ background: "#C8956C", ...bgStyle, padding: outerPad, borderRadius: Math.round(4*S) }} className="shadow-2xl">
        <div className="relative" style={{ background: "#EED9B8", padding: innerPad }}>
          {grid}
          {Array.from({ length: count }).map((_, i) => {
            const col = i % cols, row = Math.floor(i / cols);
            const sx = innerPad + col * (slotSize + gap);
            const sy = innerPad + row * (slotSize + gap);
            return [
              <div key={`tl${i}`} style={{ ...tapeBase, left: sx + slotSize*0.08, top: sy - tapeH/2, transform: "rotate(-7deg)" }} />,
              <div key={`tr${i}`} style={{ ...tapeBase, left: sx + slotSize*0.72, top: sy - tapeH/2, transform: "rotate(7deg)" }} />,
              <div key={`bl${i}`} style={{ ...tapeBase, left: sx + slotSize*0.08, top: sy + slotSize - tapeH/2, transform: "rotate(7deg)" }} />,
              <div key={`br${i}`} style={{ ...tapeBase, left: sx + slotSize*0.72, top: sy + slotSize - tapeH/2, transform: "rotate(-7deg)" }} />,
            ];
          })}
        </div>
      </div>,
      "#5C3A1E",
      "#8B5C30",
    ) as React.ReactElement;
  }

  if (templateId === "neon") {
    const pad = Math.round(12 * S);
    return withText(
      <div style={{ background: "#050508", ...bgStyle, padding: pad, borderRadius: Math.round(8*S) }} className="shadow-2xl">
        {grid}
      </div>,
      "#c084fc",
      "#7c3aed",
    ) as React.ReactElement;
  }

  if (templateId === "pastel") {
    const pad  = Math.round(14 * S);
    const hr   = Math.max(8, Math.round(10 * S));
    const heartStyle = { position: "absolute" as const, color: "#D8A0C8", fontSize: hr, lineHeight: 1, opacity: 0.75 };
    return withText(
      <div className="relative shadow-2xl" style={{ background: "#F0EBFF", ...bgStyle, padding: pad, borderRadius: Math.round(16*S) }}>
        <span style={{ ...heartStyle, top: Math.round(4*S), left: Math.round(6*S) }}>♥</span>
        <span style={{ ...heartStyle, top: Math.round(4*S), right: Math.round(6*S) }}>♥</span>
        <span style={{ ...heartStyle, bottom: Math.round(4*S), left: Math.round(6*S) }}>♥</span>
        <span style={{ ...heartStyle, bottom: Math.round(4*S), right: Math.round(6*S) }}>♥</span>
        <div style={{ overflow: "hidden", borderRadius: Math.round(8*S) }}>{grid}</div>
      </div>,
      "#9b59b6",
      "#c084fc",
    ) as React.ReactElement;
  }

  if (templateId === "strip") {
    const pad     = Math.round(10 * S);
    const headerH = Math.round(22 * S);
    const footerH = Math.round(18 * S);
    const title   = printTitle || "PHOTO BOOTH";
    const date    = printDate  || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return (
      <div style={{ background: "#fff", ...bgStyle, paddingLeft: pad, paddingRight: pad }} className="shadow-2xl">
        <div style={{ height: headerH, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #e5e5e5" }}>
          <span style={{ fontSize: Math.max(6, Math.round(7*S)), fontWeight: 700, letterSpacing: "0.14em", color: "#111", textTransform: "uppercase" as const }}>{title}</span>
        </div>
        <div style={{ padding: `${pad}px 0` }}>{grid}</div>
        <div style={{ height: footerH, display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid #e5e5e5" }}>
          <span style={{ fontSize: Math.max(5, Math.round(6*S)), color: "#aaa", letterSpacing: "0.08em" }}>{date}</span>
        </div>
      </div>
    );
  }

  // ── Default (none) ──────────────────────────────────────────────────────────
  return withText(
    <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
      {grid}
    </div>,
    "#cccccc",
    "#666666",
  ) as React.ReactElement;
}
