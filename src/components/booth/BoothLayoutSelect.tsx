"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeroBackground } from "@/components/hero/HeroBackground";
import { cn } from "@/lib/utils";

const LAYOUTS = [
  { id: "1photo",    name: "1 Photo",        count: 1, cols: 1, rows: 1 },
  { id: "2side",     name: "2 Side by Side", count: 2, cols: 2, rows: 1 },
  { id: "2stacked",  name: "2 Stacked",      count: 2, cols: 1, rows: 2 },
  { id: "3stacked",  name: "3 Stacked",      count: 3, cols: 1, rows: 3 },
  { id: "4grid",     name: "4 Grid",         count: 4, cols: 2, rows: 2 },
  { id: "3strip",    name: "3 Strip",        count: 3, cols: 3, rows: 1 },
] as const;

export function BoothLayoutSelect() {
  const router = useRouter();

  async function handleLayoutPick(id: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      // denied or unavailable — let the studio page handle it
    }
    router.push(`/studio?layout=${id}`);
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#07001a]">
      <HeroBackground />

      {/* Back nav */}
      <nav className="relative z-20 flex-shrink-0 p-4 sm:p-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 14 14"
            fill="currentColor"
            aria-hidden
          >
            <path d="M3.22 6.22a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L5.06 7l3.47-3.47a.75.75 0 0 0-1.06-1.06L3.22 6.22Z" />
          </svg>
          Back
        </Link>
      </nav>

      {/* Centered content */}
      <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto px-5 py-6">
        <div className="w-full max-w-[640px]">

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Choose a Layout
            </h1>
            <p className="mt-2.5 text-sm text-zinc-500">
              Pick how many photos your strip will have
            </p>
          </div>

          {/* Layout grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {LAYOUTS.map((layout) => (
              <LayoutCard key={layout.id} layout={layout} onPick={handleLayoutPick} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── LayoutCard ───────────────────────────────────────────────────────────────

type Layout = (typeof LAYOUTS)[number];

function LayoutCard({ layout, onPick }: { layout: Layout; onPick: (id: string) => void }) {
  return (
    <button
      onClick={() => onPick(layout.id)}
      className={cn(
        "group flex h-44 flex-col overflow-hidden rounded-2xl",
        "border border-white/10 bg-white/[0.04]",
        "transition-all duration-200",
        "hover:-translate-y-1 hover:border-violet-500/40 hover:bg-white/[0.07]",
        "hover:shadow-[0_8px_32px_-4px_rgba(139,92,246,0.28)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[#07001a]"
      )}
    >
      {/* Preview area */}
      <div className="min-h-0 flex-1 p-3">
        <div className="h-full w-full overflow-hidden rounded-xl border border-white/8 bg-black/30 p-2.5">
          <div
            className="h-full w-full"
            style={{
              display: "grid",
              gap: "5px",
              gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
              gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
            }}
          >
            {Array.from({ length: layout.cols * layout.rows }).map((_, i) => (
              <div
                key={i}
                className="rounded-md border border-white/8 bg-white/10 transition-colors duration-200 group-hover:bg-white/[0.15]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="flex-shrink-0 px-3 pb-3 text-center">
        <p className="text-sm font-semibold text-white">{layout.name}</p>
        <p className="mt-0.5 text-xs text-zinc-500">
          {layout.count} photo{layout.count !== 1 ? "s" : ""}
        </p>
      </div>
    </button>
  );
}
