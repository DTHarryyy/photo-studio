import { ENV } from "@/lib/config/env";
import type { ApiError } from "@/types/api.types";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...init } = options;
  const url = new URL(path, ENV.apiBaseUrl || window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      message: res.statusText,
      status: res.status,
    }));
    throw error;
  }

  return res.json() as Promise<T>;
}
