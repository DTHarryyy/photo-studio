import { Container } from "@/components/ui/Container";
import { HeroCTA } from "./HeroCTA";

export function HeroContent() {
  return (
    <Container>
      {/*
        Spacing hierarchy (Apple-level discipline):
          badge → headline : mt-10  (generous breath, badge feels detached/floating)
          headline → sub   : mt-6   (tight, sub reads as continuation of headline)
          sub → CTA        : mt-10  (action is visually separated from description)
      */}
      <div className="mx-auto flex max-w-4xl flex-col items-center py-28 text-center sm:py-36">

        {/* ── Badge ── */}
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
          <span className="animate-badge-dot h-1.5 w-1.5 rounded-full bg-violet-400" />
          <span className="text-xs font-medium text-zinc-300 tracking-wide">
            AI Photo Studio · New in 2026
          </span>
        </div>

        {/* ── Headline ── */}
        <h1 className="mt-10 text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
          Create cinematic{" "}
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-400 bg-clip-text text-transparent">
            photo moments
          </span>{" "}
          instantly
        </h1>

        {/* ── Subtitle ── */}
        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-zinc-500 sm:text-xl">
          Templates, AI filters, and creative effects — all in one studio.{" "}
          Turn ordinary photos into aesthetic, social-ready creations in seconds.
        </p>

        {/* ── CTA ── */}
        <div className="mt-10">
          <HeroCTA />
        </div>

      </div>
    </Container>
  );
}
