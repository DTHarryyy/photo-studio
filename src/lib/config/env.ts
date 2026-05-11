export const ENV = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  storageBaseUrl: process.env.NEXT_PUBLIC_STORAGE_BASE_URL ?? "",
  isDev: process.env.NODE_ENV === "development",
} as const;
