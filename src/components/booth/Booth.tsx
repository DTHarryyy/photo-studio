"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  templates,
  ALL_CATEGORIES,
  type BoothTemplate,
  type TemplateCategory,
} from "@/data/templates";
import { HeroBackground } from "@/components/hero/HeroBackground";
import { cn } from "@/lib/utils";
import { BoothTemplateCard } from "./BoothTemplateCard";
import { BoothPreviewPanel } from "./BoothPreviewPanel";

type ActiveCategory = "All" | TemplateCategory;

export function Booth() {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<BoothTemplate | null>(null);

  const filtered = useMemo(
    () =>
      templates.filter((t) => {
        if (activeCategory !== "All" && t.category !== activeCategory)
          return false;
        if (premiumOnly && !t.isPremium) return false;
        if (
          searchQuery &&
          !t.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;
        return true;
      }),
    [activeCategory, searchQuery, premiumOnly]
  );

  function handleSelect(template: BoothTemplate) {
    setSelectedTemplate((prev) =>
      prev?.id === template.id ? null : template
    );
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#07001a]">
      <HeroBackground />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="relative z-20 flex h-14 flex-shrink-0 items-center border-b border-white/8 bg-[#07001a]/80 px-4 backdrop-blur-sm">
        <Link
          href="/booth"
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 14 14"
            fill="currentColor"
            aria-hidden
          >
            <path d="M3.22 6.22a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L5.06 7l3.47-3.47a.75.75 0 0 0-1.06-1.06L3.22 6.22Z" />
          </svg>
          Layouts
        </Link>

        <div className="flex flex-1 items-center justify-center">
          <h1 className="text-sm font-semibold text-white">
            Choose Your Template
          </h1>
        </div>

        <span className="min-w-[80px] text-right text-xs text-zinc-500">
          {filtered.length} template{filtered.length !== 1 ? "s" : ""}
        </span>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* Sidebar — desktop only */}
        <aside className="hidden w-56 flex-shrink-0 flex-col gap-5 overflow-y-auto border-r border-white/8 p-4 md:flex">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search templates…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-8 pr-3 text-xs text-white placeholder:text-zinc-500 transition-colors focus:border-violet-500/50 focus:bg-white/8 focus:outline-none"
            />
          </div>

          {/* Categories */}
          <div>
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              Style
            </p>
            <div className="flex flex-col gap-0.5">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-left text-sm transition-all duration-150",
                    activeCategory === cat
                      ? "bg-violet-600/20 font-medium text-violet-300"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Premium toggle */}
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-zinc-400">Premium only</span>
            <button
              role="switch"
              aria-checked={premiumOnly}
              onClick={() => setPremiumOnly((v) => !v)}
              className={cn(
                "relative h-5 w-9 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                premiumOnly ? "bg-violet-600" : "bg-white/15"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
                  premiumOnly ? "translate-x-[18px]" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile filter pills */}
          <div className="flex flex-shrink-0 gap-2 overflow-x-auto border-b border-white/8 px-4 py-3 md:hidden">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150",
                  activeCategory === cat
                    ? "bg-violet-600 text-white shadow-[0_2px_12px_-2px_rgba(139,92,246,0.5)]"
                    : "border border-white/15 text-zinc-400 hover:border-white/25 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Template grid */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-5">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((template) => (
                  <BoothTemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate?.id === template.id}
                    onClick={() => handleSelect(template)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 text-3xl text-zinc-600">✦</div>
                <p className="text-sm text-zinc-500">No templates match your filters</p>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                    setPremiumOnly(false);
                  }}
                  className="mt-3 text-xs text-violet-400 underline-offset-2 hover:text-violet-300 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>

        {/* Desktop preview panel */}
        <div
          className="hidden flex-shrink-0 overflow-hidden transition-all duration-300 ease-out lg:block"
          style={{
            width: selectedTemplate ? "380px" : "0",
            borderLeft: selectedTemplate ? "1px solid rgba(255,255,255,0.08)" : "none",
          }}
        >
          {selectedTemplate && (
            <BoothPreviewPanel
              key={selectedTemplate.id}
              template={selectedTemplate}
              onClose={() => setSelectedTemplate(null)}
            />
          )}
        </div>
      </div>

      {/* Mobile preview modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTemplate(null)}
          />
          {/* Bottom sheet */}
          <div className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border-t border-white/10 bg-[#0c0520]">
            {/* Drag handle */}
            <div className="flex justify-center py-3">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>
            <BoothPreviewPanel
              key={`mobile-${selectedTemplate.id}`}
              template={selectedTemplate}
              onClose={() => setSelectedTemplate(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
