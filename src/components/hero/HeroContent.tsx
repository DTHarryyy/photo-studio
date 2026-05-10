import { Container } from "@/components/ui/Container";
import { HeroCTA } from "./HeroCTA";

export function HeroContent() {
  return (
    <Container>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 py-24 text-center sm:py-32">

        {/* Beta badge */}
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          <span className="text-xs font-medium text-zinc-300 tracking-wide">
            AI Photo Booth · Now in beta
          </span>
        </div>

        {/* Headline — the single most important element on the page */}
        <h1 className="text-5xl font-extrabold leading-[1.07] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
          Turn events into{" "}
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-rose-300 bg-clip-text text-transparent">
            unforgettable
          </span>{" "}
          photo experiences
        </h1>

        {/* Value proposition — scannable in under 3 seconds */}
        <p className="max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          Capture moments. Create memories. Pitik transforms any event into a
          cinematic AI-powered photo booth — instantly shareable, infinitely
          magical.
        </p>

        <HeroCTA />
      </div>
    </Container>
  );
}
