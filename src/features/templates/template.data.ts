import type { TemplateDefinition } from "./types/template.types";

const VIEWPORT = 1080;

export const TEMPLATE_DATA: TemplateDefinition[] = [
  {
    id: "1x1-basic",
    name: "Single Square",
    thumbnail: "/assets/templates/thumbnails/1x1-basic.png",
    aspectRatio: "1:1",
    grid: {
      cols: 1,
      rows: 1,
      slots: [{ x: 0, y: 0, width: VIEWPORT, height: VIEWPORT }],
    },
    frame: { borderRadius: 0 },
  },
  {
    id: "2x1-split",
    name: "Side by Side",
    thumbnail: "/assets/templates/thumbnails/2x1-split.png",
    aspectRatio: "1:1",
    grid: {
      cols: 2,
      rows: 1,
      slots: [
        { x: 0, y: 0, width: VIEWPORT / 2, height: VIEWPORT },
        { x: VIEWPORT / 2, y: 0, width: VIEWPORT / 2, height: VIEWPORT },
      ],
    },
    frame: { borderRadius: 0 },
  },
  {
    id: "3x2-grid",
    name: "6-Shot Grid",
    thumbnail: "/assets/templates/thumbnails/3x2-grid.png",
    aspectRatio: "1:1",
    grid: {
      cols: 3,
      rows: 2,
      slots: Array.from({ length: 6 }, (_, i) => ({
        x: (i % 3) * (VIEWPORT / 3),
        y: Math.floor(i / 3) * (VIEWPORT / 2),
        width: VIEWPORT / 3,
        height: VIEWPORT / 2,
      })),
    },
    frame: { borderRadius: 0 },
  },
];
