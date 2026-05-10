"use client";

import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Slider({ label, ...props }: Props) {
  return (
    <label className="flex flex-col gap-1 text-sm text-zinc-300">
      {label && <span>{label}</span>}
      <input type="range" {...props} className="accent-blue-500" />
    </label>
  );
}
