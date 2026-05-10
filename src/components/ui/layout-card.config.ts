// Plain data module — no React, no "use client".
// Safe to import in both Server and Client Components.

export type Theme = "pink" | "violet" | "blue" | "cyan" | "amber";
export type LayoutType = "1x1" | "2x1" | "3x1" | "2x2" | "3x2";

export interface LayoutConfig {
  type: LayoutType;
  cols: number;
  rows: number;
  label: string;
  subtitle: string;
  theme: Theme;
}

export const LAYOUT_CONFIGS: Record<LayoutType, LayoutConfig> = {
  "1x1": { type: "1x1", cols: 1, rows: 1, label: "1×1 Layout", subtitle: "Single shot",  theme: "pink"   },
  "2x1": { type: "2x1", cols: 2, rows: 1, label: "2×1 Layout", subtitle: "Side by side", theme: "violet" },
  "3x1": { type: "3x1", cols: 3, rows: 1, label: "3×1 Layout", subtitle: "Photo strip",  theme: "blue"   },
  "2x2": { type: "2x2", cols: 2, rows: 2, label: "2×2 Layout", subtitle: "Booth grid",   theme: "cyan"   },
  "3x2": { type: "3x2", cols: 3, rows: 2, label: "3×2 Layout", subtitle: "Grid collage", theme: "amber"  },
};
