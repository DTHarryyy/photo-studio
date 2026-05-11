export type TemplateCategory =
  | "Minimal"
  | "Vintage"
  | "Film"
  | "Y2K"
  | "Wedding"
  | "Corporate";

export const ALL_CATEGORIES: Array<"All" | TemplateCategory> = [
  "All",
  "Minimal",
  "Vintage",
  "Film",
  "Y2K",
  "Wedding",
  "Corporate",
];

export interface BoothTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  gradient: string;
  frameStyle: "polaroid" | "strip" | "cinematic" | "arch" | "grid" | "square";
  isPremium: boolean;
  accentColor: string;
  tags: string[];
}

export const templates: BoothTemplate[] = [
  // ── Minimal ──────────────────────────────────────────────────────────────
  {
    id: "clean-canvas",
    name: "Clean Canvas",
    category: "Minimal",
    description:
      "A crisp, white-bordered polaroid with maximum breathing room. Let the moment speak.",
    gradient: "linear-gradient(145deg, #e8e8f0 0%, #d4d4e8 50%, #c8c8e0 100%)",
    frameStyle: "polaroid",
    isPremium: false,
    accentColor: "#818cf8",
    tags: ["clean", "white", "simple"],
  },
  {
    id: "mono-edit",
    name: "Mono Edit",
    category: "Minimal",
    description: "High-contrast black and white. Drama without distraction.",
    gradient: "linear-gradient(145deg, #2d2d2d 0%, #1a1a2e 40%, #0f0f1a 100%)",
    frameStyle: "square",
    isPremium: false,
    accentColor: "#a1a1aa",
    tags: ["black", "white", "minimal"],
  },
  {
    id: "pastel-haze",
    name: "Pastel Haze",
    category: "Minimal",
    description:
      "Soft, dreamy pastels that make every shot feel effortlessly aesthetic.",
    gradient: "linear-gradient(145deg, #fce4ec 0%, #e1bee7 40%, #bbdefb 100%)",
    frameStyle: "arch",
    isPremium: false,
    accentColor: "#f48fb1",
    tags: ["pastel", "soft", "aesthetic"],
  },

  // ── Vintage ───────────────────────────────────────────────────────────────
  {
    id: "golden-hour",
    name: "Golden Hour",
    category: "Vintage",
    description:
      "Warm amber tones and a classic polaroid frame. Every shot looks like magic hour.",
    gradient:
      "linear-gradient(145deg, #f59e0b 0%, #d97706 35%, #92400e 70%, #78350f 100%)",
    frameStyle: "polaroid",
    isPremium: false,
    accentColor: "#f59e0b",
    tags: ["warm", "amber", "golden"],
  },
  {
    id: "faded-memory",
    name: "Faded Memory",
    category: "Vintage",
    description:
      "Sepia tones and a weathered strip. Like a photo found in an old shoebox.",
    gradient:
      "linear-gradient(145deg, #c9a882 0%, #a17c5b 40%, #6b4c30 100%)",
    frameStyle: "strip",
    isPremium: true,
    accentColor: "#c9a882",
    tags: ["sepia", "vintage", "nostalgic"],
  },

  // ── Film ──────────────────────────────────────────────────────────────────
  {
    id: "kodachrome",
    name: "Kodachrome",
    category: "Film",
    description:
      "Vibrant, saturated colors inspired by the legendary Kodak film stock. Pure cinema.",
    gradient:
      "linear-gradient(145deg, #dc2626 0%, #ea580c 25%, #16a34a 60%, #2563eb 100%)",
    frameStyle: "cinematic",
    isPremium: true,
    accentColor: "#ea580c",
    tags: ["vibrant", "film", "cinematic"],
  },
  {
    id: "noir",
    name: "Noir",
    category: "Film",
    description:
      "Deep shadows, high contrast. Channel your inner film noir protagonist.",
    gradient:
      "linear-gradient(145deg, #0f172a 0%, #1e293b 40%, #0a0a0f 100%)",
    frameStyle: "cinematic",
    isPremium: false,
    accentColor: "#64748b",
    tags: ["dark", "moody", "noir"],
  },
  {
    id: "fuji-dreams",
    name: "Fuji Dreams",
    category: "Film",
    description:
      "Soft, faded pastels with a barely-there grain. Fujifilm's dreamy aesthetic.",
    gradient:
      "linear-gradient(145deg, #fbcfe8 0%, #c4b5fd 40%, #a5f3fc 80%, #bbf7d0 100%)",
    frameStyle: "square",
    isPremium: true,
    accentColor: "#c084fc",
    tags: ["soft", "pastel", "film"],
  },

  // ── Y2K ───────────────────────────────────────────────────────────────────
  {
    id: "cyber-pop",
    name: "Cyber Pop",
    category: "Y2K",
    description:
      "Neon gradients, holographic chaos. Max early-internet energy, 2026 execution.",
    gradient:
      "linear-gradient(145deg, #f0abfc 0%, #818cf8 30%, #38bdf8 65%, #34d399 100%)",
    frameStyle: "grid",
    isPremium: false,
    accentColor: "#818cf8",
    tags: ["neon", "holographic", "pop"],
  },
  {
    id: "digital-static",
    name: "Digital Static",
    category: "Y2K",
    description:
      "Glitchy green-on-black with scan lines. Pure matrix-era nostalgia.",
    gradient:
      "linear-gradient(145deg, #022c22 0%, #065f46 40%, #064e3b 100%)",
    frameStyle: "cinematic",
    isPremium: true,
    accentColor: "#34d399",
    tags: ["matrix", "glitch", "green"],
  },

  // ── Wedding ───────────────────────────────────────────────────────────────
  {
    id: "ivory-dream",
    name: "Ivory Dream",
    category: "Wedding",
    description:
      "Cream and gold elegance. Timeless and perfect for the most important day.",
    gradient:
      "linear-gradient(145deg, #fef9ee 0%, #fdf0d5 40%, #f3d99b 70%, #d4af6a 100%)",
    frameStyle: "arch",
    isPremium: true,
    accentColor: "#d4af6a",
    tags: ["elegant", "gold", "timeless"],
  },
  {
    id: "rose-bloom",
    name: "Rose Bloom",
    category: "Wedding",
    description: "Soft pink petals and romantic whites. Every photo a keepsake.",
    gradient:
      "linear-gradient(145deg, #fff0f3 0%, #ffdde1 35%, #ffc2c9 65%, #f9a8b3 100%)",
    frameStyle: "polaroid",
    isPremium: true,
    accentColor: "#f472b6",
    tags: ["romantic", "pink", "floral"],
  },

  // ── Corporate ─────────────────────────────────────────────────────────────
  {
    id: "executive",
    name: "Executive",
    category: "Corporate",
    description:
      "Navy and silver for teams that mean business. Professional. Polished.",
    gradient:
      "linear-gradient(145deg, #0f2557 0%, #1e3a8a 50%, #1e40af 100%)",
    frameStyle: "square",
    isPremium: false,
    accentColor: "#3b82f6",
    tags: ["professional", "navy", "business"],
  },
  {
    id: "brand-ready",
    name: "Brand Ready",
    category: "Corporate",
    description:
      "Customizable brand colors with a clean strip frame. Ready for any event.",
    gradient:
      "linear-gradient(145deg, #1e3a8a 0%, #2563eb 45%, #0284c7 100%)",
    frameStyle: "strip",
    isPremium: true,
    accentColor: "#0284c7",
    tags: ["brand", "customizable", "corporate"],
  },
];
