// Composition root for the hero section.
// Layers: background (decorative) → nav → floating cards → main content.
// Each child is independently replaceable without touching the others.
import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";
import { HeroFloatingCards } from "./HeroFloatingCards";
import { HeroNav } from "./HeroNav";

export function Hero() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06061a]">
      <HeroBackground />
      <HeroNav />
      <HeroFloatingCards />
      <main>
        <HeroContent />
      </main>
    </div>
  );
}
