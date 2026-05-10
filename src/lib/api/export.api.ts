import { apiClient } from "./client";
import type { ExportConfig } from "@/features/export";

interface ExportResponse {
  url: string;
}

export async function submitExport(
  blob: Blob,
  config: ExportConfig
): Promise<ExportResponse> {
  const body = new FormData();
  body.append("image", blob, `export.${config.format}`);
  body.append("config", JSON.stringify(config));
  return apiClient<ExportResponse>("/api/export", {
    method: "POST",
    body,
    headers: {},
  });
}
