"use client";

import Image from "next/image";
import { useExportStore } from "../store/export.store";

export function ExportPreview() {
  const outputUrl = useExportStore((s) => s.outputUrl);

  if (!outputUrl) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-zinc-800 text-zinc-500 text-sm rounded">
        No export yet
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded">
      <Image src={outputUrl} alt="Export preview" fill className="object-contain" />
    </div>
  );
}
