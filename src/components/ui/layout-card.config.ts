// Plain data module — no React, no "use client".
// Safe to import in both Server and Client Components.

export type Theme = "pink" | "violet" | "blue" | "cyan" | "amber";
export type LayoutType = "1x1" | "2x1" | "1x2" | "1x3" | "3x1" | "2x2" | "3x2";

export interface LayoutConfig {
  type: LayoutType;
  cols: number;
  rows: number;
  label: string;
  subtitle: string;
  theme: Theme;
}

export const LAYOUT_CONFIGS: Record<LayoutType, LayoutConfig> = {
  "1x1": { type: "1x1", cols: 1, rows: 1, label: "1 Photo",         subtitle: "1 photo",   theme: "pink"   },
  "2x1": { type: "2x1", cols: 2, rows: 1, label: "2 Side by Side",  subtitle: "2 photos",  theme: "violet" },
  "1x2": { type: "1x2", cols: 1, rows: 2, label: "2 Stacked",       subtitle: "2 photos",  theme: "blue"   },
  "1x3": { type: "1x3", cols: 1, rows: 3, label: "3 Stacked",       subtitle: "3 photos",  theme: "cyan"   },
  "2x2": { type: "2x2", cols: 2, rows: 2, label: "4 Grid",          subtitle: "4 photos",  theme: "amber"  },
  "3x1": { type: "3x1", cols: 3, rows: 1, label: "3 Strip",         subtitle: "3 photos",  theme: "pink"   },
  "3x2": { type: "3x2", cols: 3, rows: 2, label: "6 Grid",          subtitle: "6 photos",  theme: "cyan"   },
};
