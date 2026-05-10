import { cn } from "@/lib/utils";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07001a]";

export function HeroCTA() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">

      {/* Primary — gradient with slow glow pulse */}
      <a
        href="#templates"
        className={cn(
          BASE,
          "animate-cta-glow",
          "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500",
          "px-8 py-3.5 text-base text-white",
          "hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:brightness-100"
        )}
      >
        Try Templates <span aria-hidden>→</span>
      </a>

      {/* Secondary — premium glass */}
      <a
        href="/studio"
        className={cn(
          BASE,
          "border border-white/15 bg-white/[0.07] px-8 py-3.5 text-base text-white backdrop-blur-md",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
          "hover:-translate-y-0.5 hover:bg-white/[0.11] hover:border-white/25 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]",
          "active:translate-y-0"
        )}
      >
        Open Studio
      </a>

    </div>
  );
}
