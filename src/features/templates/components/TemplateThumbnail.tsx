"use client";

import Image from "next/image";
import type { TemplateDefinition } from "../types/template.types";

interface Props {
  template: TemplateDefinition;
  isActive: boolean;
  onSelect: () => void;
}

export function TemplateThumbnail({ template, isActive, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`relative aspect-square overflow-hidden rounded border-2 transition-colors ${
        isActive ? "border-blue-500" : "border-zinc-700"
      }`}
    >
      <Image
        src={template.thumbnail}
        alt={template.name}
        fill
        className="object-cover"
      />
      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs text-center py-1">
        {template.name}
      </span>
    </button>
  );
}
