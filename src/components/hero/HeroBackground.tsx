// Purely visual — the layered dark background with purple glow and star field.
// Kept as a dedicated component so the visual system can evolve independently
// from layout and content concerns.
export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Base: deep space navy */}
      <div className="absolute inset-0 bg-[#06061a]" />

      {/* Radial purple glow — the defining visual of the hero */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 55% at 50% -5%, rgba(109, 40, 217, 0.35) 0%, transparent 70%)",
        }}
      />

      {/* Star field: tiny dots on a repeating grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255, 255, 255, 0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Bottom vignette — fades content into page */}
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#06061a] to-transparent" />
    </div>
  );
}
