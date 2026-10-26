/** Shared client timeouts and pagination defaults. */
export const config = {
  apiTimeoutMs: 15_000,
  pageSize: 10,
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "",
} as const;
