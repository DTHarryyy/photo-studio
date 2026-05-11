"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLayerStore } from "@/features/photobooth/store/useLayerStore";

// ─── Sticker library ──────────────────────────────────────────────────────────

const STICKER_DEFS: { src: string; name: string; category: string }[] = [
  { src: "/assets/stickers/sparkles.svg",    name: "Sparkles",    category: "fun"    },
  { src: "/assets/stickers/fire.svg",        name: "Fire",        category: "fun"    },
  { src: "/assets/stickers/party-popper.svg",name: "Party",       category: "fun"    },
  { src: "/assets/stickers/balloon.svg",     name: "Balloon",     category: "fun"    },
  { src: "/assets/stickers/confetti.svg",    name: "Confetti",    category: "fun"    },
  { src: "/assets/stickers/dizzy.svg",       name: "Dizzy",       category: "fun"    },
  { src: "/assets/stickers/rainbow.svg",     name: "Rainbow",     category: "fun"    },
  { src: "/assets/stickers/star.svg",        name: "Star",        category: "fun"    },
  { src: "/assets/stickers/star-glow.svg",   name: "Glowing Star",category: "fun"    },
  { src: "/assets/stickers/heart.svg",       name: "Heart",       category: "hearts" },
  { src: "/assets/stickers/hearts-two.svg",  name: "Two Hearts",  category: "hearts" },
  { src: "/assets/stickers/heart-spark.svg", name: "Sparkling",   category: "hearts" },
  { src: "/assets/stickers/hearts-face.svg", name: "Heart Face",  category: "hearts" },
  { src: "/assets/stickers/hundred.svg",     name: "100",         category: "hearts" },
  { src: "/assets/stickers/sunglasses.svg",  name: "Cool",        category: "faces"  },
  { src: "/assets/stickers/party-face.svg",  name: "Party Face",  category: "faces"  },
  { src: "/assets/stickers/heart-eyes.svg",  name: "Heart Eyes",  category: "faces"  },
  { src: "/assets/stickers/star-struck.svg", name: "Star Struck", category: "faces"  },
  { src: "/assets/stickers/wink.svg",        name: "Wink",        category: "faces"  },
  { src: "/assets/stickers/crown.svg",       name: "Crown",       category: "style"  },
  { src: "/assets/stickers/diamond.svg",     name: "Diamond",     category: "style"  },
  { src: "/assets/stickers/blossom.svg",     name: "Blossom",     category: "style"  },
  { src: "/assets/stickers/butterfly.svg",   name: "Butterfly",   category: "style"  },
  { src: "/assets/stickers/sunflower.svg",   name: "Sunflower",   category: "style"  },
  { src: "/assets/stickers/camera.svg",      name: "Camera",      category: "style"  },
  { src: "/assets/stickers/clover.svg",      name: "Clover",      category: "style"  },
];
const CATEGORIES = [...new Set(STICKER_DEFS.map((s) => s.category))];

const TEXT_COLORS = [
  "#ffffff", "#000000", "#f87171", "#fb923c",
  "#facc15", "#4ade80", "#60a5fa", "#c084fc", "#f472b6",
];

const FONT_OPTIONS = [
  { label: "Sans",  value: "sans-serif" },
  { label: "Serif", value: "serif"      },
  { label: "Mono",  value: "monospace"  },
];

// ─── Component ────────────────────────────────────────────────────────────────

type PanelTab = "stickers" | "text";

export function EditToolPanel() {
  const [tab, setTab] = useState<PanelTab>("stickers");
  const [stickerCategory, setStickerCategory] = useState(CATEGORIES[0]);

  const { layers, selectedId, addSticker, addText, updateLayer } = useLayerStore();

  const selectedLayer = layers.find((l) => l.id === selectedId);
  const selectedSticker =
    selectedLayer?.type === "sticker" ? selectedLayer : undefined;
  const selectedText =
    selectedLayer?.type === "text" ? selectedLayer : undefined;

  // Auto-switch tab to match the selected layer type
  useEffect(() => {
    if (selectedLayer?.type === "sticker") setTab("stickers");
    if (selectedLayer?.type === "text") setTab("text");
  }, [selectedLayer?.type]);

  return (
    <div className="flex-shrink-0 border-t border-white/8 bg-black/80 backdrop-blur-xl">
      {/* ── Tab strip ──────────────────────────────────────────────────── */}
      <div className="flex border-b border-white/8">
        {(["stickers", "text"] as PanelTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-2.5 text-xs font-semibold capitalize transition-colors",
              tab === t
                ? "border-b-2 border-violet-500 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {t === "stickers" ? "✦ Stickers" : "T Text"}
          </button>
        ))}
      </div>

      {/* ── Tab content ────────────────────────────────────────────────── */}
      <div className="px-0 py-2">
        {tab === "stickers" && (
          <StickersPanel
            category={stickerCategory}
            onCategory={setStickerCategory}
            onAdd={addSticker}
            selectedSticker={selectedSticker}
            onUpdate={(patch) => selectedSticker && updateLayer(selectedSticker.id, patch)}
          />
        )}
        {tab === "text" && (
          <TextPanel
            onAdd={addText}
            selectedText={selectedText}
            onUpdate={(patch) => selectedText && updateLayer(selectedText.id, patch)}
          />
        )}
      </div>
    </div>
  );
}

// ─── Stickers panel ───────────────────────────────────────────────────────────

function StickersPanel({
  category,
  onCategory,
  onAdd,
  selectedSticker,
  onUpdate,
}: {
  category: string;
  onCategory: (c: string) => void;
  onAdd: (src: string, name: string) => void;
  selectedSticker: Extract<ReturnType<typeof useLayerStore.getState>["layers"][number], { type: "sticker" }> | undefined;
  onUpdate: (patch: { size?: number }) => void;
}) {
  const visible = STICKER_DEFS.filter((s) => s.category === category);

  return (
    <div className="flex flex-col gap-2">
      {/* Category chips */}
      <div className="flex gap-1.5 overflow-x-auto px-3 pb-0.5 scrollbar-none">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => onCategory(c)}
            className={cn(
              "flex-shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold capitalize transition-colors",
              c === category
                ? "bg-violet-600 text-white"
                : "bg-white/8 text-zinc-400 hover:bg-white/15 hover:text-white"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Sticker row — horizontally scrollable */}
      <div className="flex gap-2 overflow-x-auto px-3 pb-1 scrollbar-none">
        {visible.map((s) => (
          <button
            key={s.src}
            onClick={() => onAdd(s.src, s.name)}
            title={s.name}
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/5 p-2 transition-all hover:bg-white/12 hover:scale-110 active:scale-95"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.name} className="h-full w-full object-contain" draggable={false} />
          </button>
        ))}
      </div>

      {/* Size control — only when a sticker is selected */}
      {selectedSticker && (
        <div className="mx-3 flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2">
          <span className="text-[10px] font-semibold text-zinc-500 w-8">Size</span>
          <input
            type="range"
            min={5}
            max={60}
            step={1}
            value={selectedSticker.size}
            onChange={(e) => onUpdate({ size: Number(e.target.value) })}
            className="flex-1 accent-violet-500"
          />
          <span className="w-7 text-right text-[10px] text-zinc-500">{Math.round(selectedSticker.size)}%</span>
        </div>
      )}
    </div>
  );
}

// ─── Text panel ───────────────────────────────────────────────────────────────

function TextPanel({
  onAdd,
  selectedText,
  onUpdate,
}: {
  onAdd: () => void;
  selectedText: Extract<ReturnType<typeof useLayerStore.getState>["layers"][number], { type: "text" }> | undefined;
  onUpdate: (patch: { fontSize?: number; fontFamily?: string; color?: string }) => void;
}) {
  return (
    <div className="flex flex-col gap-2 px-3">
      {/* Add text button */}
      <button
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] py-2.5 text-sm font-medium text-zinc-400 transition-all hover:border-violet-500/50 hover:bg-violet-600/10 hover:text-white active:scale-[0.98]"
      >
        <span className="text-base font-bold leading-none">T</span>
        Add Text
      </button>

      {/* Controls when text is selected */}
      {selectedText ? (
        <div className="flex flex-col gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] p-3">
          {/* Font size */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold text-zinc-500 w-8">Size</span>
            <input
              type="range"
              min={4}
              max={25}
              step={0.5}
              value={selectedText.fontSize}
              onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
              className="flex-1 accent-violet-500"
            />
            <span className="w-7 text-right text-[10px] text-zinc-500">{Math.round(selectedText.fontSize)}%</span>
          </div>

          {/* Font family */}
          <div className="flex gap-1.5">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f.value}
                onClick={() => onUpdate({ fontFamily: f.value })}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors",
                  selectedText.fontFamily === f.value
                    ? "bg-violet-600 text-white"
                    : "bg-white/8 text-zinc-400 hover:bg-white/15"
                )}
                style={{ fontFamily: f.value }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Color swatches */}
          <div className="flex flex-wrap gap-1.5">
            {TEXT_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onUpdate({ color: c })}
                className={cn(
                  "h-6 w-6 rounded-full transition-transform",
                  selectedText.color === c
                    ? "ring-2 ring-violet-400 ring-offset-1 ring-offset-black scale-110"
                    : "ring-1 ring-white/15 hover:scale-110"
                )}
                style={{ background: c }}
                aria-label={c}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-[10px] leading-relaxed text-zinc-700">
          Tap Add Text, then double-tap on the canvas to edit
        </p>
      )}
    </div>
  );
}
