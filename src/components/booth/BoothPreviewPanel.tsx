"use client";

import type { BoothTemplate } from "@/data/templates";
import { BoothFrame } from "./BoothFrame";
import { Button } from "@/components/ui/Button";

interface Props {
  template: BoothTemplate;
  onClose: () => void;
}

export function BoothPreviewPanel({ template, onClose }: Props) {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/8 px-5 py-3.5">
        <p className="text-sm font-semibold text-white">Live Preview</p>
        <button
          onClick={onClose}
          aria-label="Close preview"
          className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          >
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
      </div>

      {/* Frame preview */}
      <div className="flex-shrink-0 p-5 pb-4">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl shadow-[0_8px_48px_-8px_rgba(0,0,0,0.6)]">
          <BoothFrame template={template} />
        </div>
      </div>

      {/* Template info */}
      <div className="flex flex-1 flex-col px-5 pb-6">
        {/* Name + badges */}
        <div>
          <h2 className="text-lg font-bold text-white">{template.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${template.accentColor}18`,
                color: template.accentColor,
                borderColor: `${template.accentColor}30`,
              }}
            >
              {template.category}
            </span>
            {template.isPremium && (
              <span className="rounded-full border border-violet-500/25 bg-violet-600/15 px-2.5 py-0.5 text-xs font-medium text-violet-300">
                Pro
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          {template.description}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/8 px-2.5 py-0.5 text-xs text-zinc-500"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-2.5">
          <Button variant="primary" size="lg" className="w-full justify-center">
            Use This Template
            <span aria-hidden>→</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full cursor-not-allowed justify-center opacity-50"
            disabled
          >
            Try with Camera
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-400">
              Soon
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
