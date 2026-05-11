"use client";

import { cn } from "@/lib/utils";
import type { BoothTemplate } from "@/data/templates";
import { BoothFrame } from "./BoothFrame";

interface Props {
  template: BoothTemplate;
  isSelected: boolean;
  onClick: () => void;
}

export function BoothTemplateCard({ template, isSelected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl text-left",
        "border transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[#07001a]",
        isSelected
          ? "border-violet-500/70 shadow-[0_0_0_1px_rgba(139,92,246,0.25),0_8px_40px_-4px_rgba(139,92,246,0.45)]"
          : "border-white/8 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_8px_32px_-4px_rgba(139,92,246,0.22)]"
      )}
    >
      {/* Frame preview */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0a0a1a]">
        <BoothFrame template={template} />

        {/* Premium badge */}
        {template.isPremium && (
          <div className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-lg">
            Pro
          </div>
        )}

        {/* Selected checkmark */}
        {isSelected && (
          <div className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 shadow-lg">
            <svg
              className="h-3 w-3 text-white"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6l3 3 5-5" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/8" />
      </div>

      {/* Card footer */}
      <div className="flex-shrink-0 bg-white/[0.04] px-3 py-2.5">
        <p className="truncate text-sm font-medium leading-tight text-white">
          {template.name}
        </p>
        <span
          className="mt-0.5 inline-block text-xs font-medium"
          style={{ color: template.accentColor }}
        >
          {template.category}
        </span>
      </div>
    </button>
  );
}
