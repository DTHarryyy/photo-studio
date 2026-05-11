export type ExportFormat = "png" | "jpeg" | "webp";
export type ExportStatus = "idle" | "processing" | "done" | "error";

export interface ExportConfig {
  format: ExportFormat;
  quality: number;
  width: number;
  height: number;
}

export interface ExportResult {
  blob: Blob;
  url: string;
  format: ExportFormat;
}
