import { cn } from "@/lib/utils";

// Anchor tags styled as buttons — no client JS needed for simple href CTAs.
// The primary action uses a gradient matching the brand; secondary is glass.
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500";

export function HeroCTA() {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <a
        href="#demo"
        className={cn(
          BASE,
          "bg-gradient-to-r from-violet-600 to-pink-500 px-7 py-3.5 text-base text-white shadow-lg shadow-violet-500/25 hover:opacity-90"
        )}
      >
        Try Live Booth <span aria-hidden>→</span>
      </a>
      <a
        href="#how-it-works"
        className={cn(
          BASE,
          "border border-white/20 bg-white/10 px-7 py-3.5 text-base text-white backdrop-blur-sm hover:bg-white/15"
        )}
      >
        See how it works
      </a>
    </div>
  );
}
