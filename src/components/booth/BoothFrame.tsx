import type { BoothTemplate } from "@/data/templates";

interface Props {
  template: BoothTemplate;
}

export function BoothFrame({ template }: Props) {
  return (
    <div className="absolute inset-0" style={{ background: template.gradient }}>
      <FrameOverlay frameStyle={template.frameStyle} />
      <PersonPlaceholder />
    </div>
  );
}

function FrameOverlay({
  frameStyle,
}: {
  frameStyle: BoothTemplate["frameStyle"];
}) {
  if (frameStyle === "polaroid") {
    return (
      <>
        <div className="absolute inset-3 bottom-9 ring-1 ring-inset ring-white/25" />
        <div
          className="absolute inset-x-0 bottom-0 h-9"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
      </>
    );
  }

  if (frameStyle === "strip") {
    return (
      <>
        {[25, 50, 75].map((pct) => (
          <div
            key={pct}
            className="absolute inset-x-0 h-px bg-white/20"
            style={{ top: `${pct}%` }}
          />
        ))}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/15" />
      </>
    );
  }

  if (frameStyle === "cinematic") {
    return (
      <>
        <div className="absolute inset-x-0 top-0 h-[20%] bg-black/60" />
        <div className="absolute inset-x-0 bottom-0 h-[20%] bg-black/60" />
        {/* Film sprocket holes */}
        <div className="absolute left-1.5 top-[7%] h-1.5 w-1 rounded-sm bg-white/12" />
        <div className="absolute right-1.5 top-[7%] h-1.5 w-1 rounded-sm bg-white/12" />
        <div className="absolute left-1.5 bottom-[7%] h-1.5 w-1 rounded-sm bg-white/12" />
        <div className="absolute right-1.5 bottom-[7%] h-1.5 w-1 rounded-sm bg-white/12" />
      </>
    );
  }

  if (frameStyle === "arch") {
    return (
      <div
        className="absolute inset-3 ring-1 ring-white/20"
        style={{ borderRadius: "48% 48% 6px 6px / 36% 36% 6px 6px" }}
      />
    );
  }

  if (frameStyle === "grid") {
    return (
      <>
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-px bg-white/20" />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-px bg-white/20" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/15" />
      </>
    );
  }

  // square (default)
  return <div className="absolute inset-3 ring-1 ring-white/20" />;
}

function PersonPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        viewBox="0 0 60 90"
        className="h-1/2 w-auto text-white opacity-[0.18]"
        fill="currentColor"
        aria-hidden
      >
        <circle cx="30" cy="18" r="13" />
        <path d="M8 90 Q8 50 30 50 Q52 50 52 90Z" />
      </svg>
    </div>
  );
}
