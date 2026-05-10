import { cn } from "@/lib/utils";

interface FloatingCard {
  label: string;
  gradient: string;
  position: string;
  rotation: string;
  dimensions: string;
}

// Cards are decorative — hidden on smaller screens to avoid layout interference.
const CARDS: FloatingCard[] = [
  {
    label: "Wedding · 2025",
    gradient: "from-pink-400 to-purple-500",
    position: "left-[3%] top-[32%]",
    rotation: "-rotate-12",
    dimensions: "w-24 h-36",
  },
  {
    label: "Birthday Bash",
    gradient: "from-violet-500 to-purple-700",
    position: "right-[5%] top-[22%]",
    rotation: "rotate-6",
    dimensions: "w-24 h-36",
  },
  {
    label: "Brand Launch",
    gradient: "from-sky-400 to-cyan-300",
    position: "right-[1%] bottom-[16%]",
    rotation: "rotate-3",
    dimensions: "w-20 h-32",
  },
];

export function HeroFloatingCards() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
      {CARDS.map((card) => (
        <div
          key={card.label}
          className={cn(
            "absolute rounded-2xl shadow-2xl",
            `bg-gradient-to-br ${card.gradient}`,
            card.position,
            card.rotation,
            card.dimensions
          )}
        >
          <span className="absolute bottom-2.5 left-0 right-0 text-center text-[10px] font-medium text-white/80">
            {card.label}
          </span>
        </div>
      ))}
    </div>
  );
}
