// Composition root for the hero section.
// Layers: background (decorative) → nav → floating cards → main content.
// Each child is independently replaceable without touching the others.
import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";
import { HeroNav } from "./HeroNav";

export function Hero() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07001a]">
      <HeroBackground />
      <HeroNav />
      <main>
        <HeroContent />
      </main>
    </div>
  );
}
