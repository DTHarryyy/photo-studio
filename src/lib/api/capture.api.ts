import { apiClient } from "./client";

interface CaptureResponse {
  url: string;
}

export async function uploadCapture(blob: Blob): Promise<CaptureResponse> {
  const body = new FormData();
  body.append("image", blob, "capture.png");
  return apiClient<CaptureResponse>("/api/capture", {
    method: "POST",
    body,
    headers: {},
  });
}
