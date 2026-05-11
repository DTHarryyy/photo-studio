"use client";

import { useRef, useState } from "react";
import { exportCanvas } from "../export.engine";
import { triggerDownload } from "../export.utils";
import { useExportStore } from "../store/export.store";
import type { ExportFormat } from "../types/export.types";

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function ExportPanel({ canvasRef }: Props) {
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState(90);
  const { status, setStatus, setOutputUrl } = useExportStore();

  async function handleExport() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setStatus("processing");
    try {
      const result = await exportCanvas(canvas, {
        format,
        quality,
        width: canvas.width,
        height: canvas.height,
      });
      setOutputUrl(result.url);
      setStatus("done");
      triggerDownload(result.url, `photo-studio-export.${format}`);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <label className="flex flex-col gap-1 text-sm text-zinc-300">
        Format
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as ExportFormat)}
          className="bg-zinc-800 rounded px-2 py-1 text-white"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WebP</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm text-zinc-300">
        Quality: {quality}%
        <input
          type="range"
          min={10}
          max={100}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="accent-blue-500"
        />
      </label>
      <button
        onClick={handleExport}
        disabled={status === "processing"}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {status === "processing" ? "Exporting…" : "Export & Download"}
      </button>
    </div>
  );
}
