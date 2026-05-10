// Purely visual — layered dark background, purple glow, star fields, grain.
// Zero interactivity and zero layout impact (absolute inset, -z-10).
export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>

      {/* ── Base ── */}
      <div className="absolute inset-0 bg-[#07001a]" />

      {/* ── Primary glow — large violet burst from top-center ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 115% 62% at 50% -10%, rgba(120,40,220,0.92) 0%, rgba(100,20,180,0.50) 32%, transparent 70%)",
        }}
      />

      {/* ── Secondary core — tighter, brighter inner hotspot ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 62% 36% at 50% 0%, rgba(165,62,255,0.48) 0%, transparent 58%)",
        }}
      />

      {/* ── Mid-page halo — soft glow anchored behind the headline ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 46%, rgba(88,28,190,0.20) 0%, transparent 62%)",
        }}
      />

      {/* ── Left ambient edge — depth behind the foreground card ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 36% 52% at -2% 58%, rgba(120,50,220,0.15) 0%, transparent 55%)",
        }}
      />

      {/* ── Right ambient edge ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 36% 52% at 102% 52%, rgba(50,20,180,0.12) 0%, transparent 55%)",
        }}
      />

      {/* ── Star field — primary (dense, fine) ── */}
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Star field — secondary (sparser, slightly larger — adds depth) ── */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.18) 1.5px, transparent 1.5px)",
          backgroundSize: "67px 67px",
          backgroundPosition: "14px 21px",
        }}
      />

      {/* ── Film grain — SVG turbulence noise for cinematic texture ── */}
      <div
        className="absolute inset-0 opacity-5 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Bottom vignette — fades into page sections below ── */}
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#07001a] to-transparent" />

    </div>
  );
}
