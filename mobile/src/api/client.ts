/** Axios API client with SecureStore auth, single-flight refresh, and clear errors. */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { cache, tokenStorage } from "../utils/storage";

const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
if (!configuredUrl) console.warn("EXPO_PUBLIC_API_URL is not set; API requests cannot connect until it is configured.");
if (configuredUrl && process.env.NODE_ENV === "production" && !configuredUrl.startsWith("https://")) {
  throw new Error("EXPO_PUBLIC_API_URL must use HTTPS in production.");
}
const apiOrigin = configuredUrl?.replace(/\/+$/, "").replace(/\/api$/, "");
const apiBaseUrl = apiOrigin ? `${apiOrigin}/api` : undefined;

export const client = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

type RetryConfig = InternalAxiosRequestConfig & { _retried?: boolean };
let refreshInFlight: Promise<string | null> | null = null;
let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

client.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function normalizeError(error: unknown): unknown {
  if (!axios.isAxiosError(error)) return error;
  const response = error.response?.data as { message?: unknown } | undefined;
  if (typeof response?.message === "string" && response.message.trim()) {
    error.message = response.message;
  } else if (error.code === "ERR_NETWORK") {
    error.message = "Unable to reach the server. Check your connection and try again.";
  } else if (error.code === "ECONNABORTED") {
    error.message = "The request timed out. Please try again.";
  }
  return error;
}

client.interceptors.response.use(
  (response) => response,
  async (rawError: AxiosError) => {
    const config = rawError.config as RetryConfig | undefined;
    if (rawError.response?.status !== 401 || !config || config._retried || config.url?.includes("/auth/")) {
      return Promise.reject(normalizeError(rawError));
    }
    config._retried = true;

    try {
      refreshInFlight ??= (async () => {
        const refreshToken = await tokenStorage.getRefresh();
        if (!refreshToken || !apiBaseUrl) return null;
        const response = await axios.post<{ accessToken: string; refreshToken?: string }>(
          `${apiBaseUrl}/auth/refresh`,
          { refreshToken },
          { timeout: 15_000 },
        );
        await tokenStorage.setAccess(response.data.accessToken);
        if (response.data.refreshToken) {
          await tokenStorage.set(response.data.accessToken, response.data.refreshToken);
        }
        return response.data.accessToken;
      })();

      const accessToken = await refreshInFlight;
      if (!accessToken) throw new Error("Your session has expired. Sign in again.");
      config.headers.Authorization = `Bearer ${accessToken}`;
      return await client(config);
    } catch (refreshError) {
      await tokenStorage.clear();
      await cache.remove("session-user");
      onSessionExpired?.();
      return Promise.reject(normalizeError(refreshError));
    } finally {
      refreshInFlight = null;
    }
  },
);

export function apiMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = (error.response?.data as { message?: unknown } | undefined)?.message;
    if (typeof responseMessage === "string" && responseMessage.trim()) return responseMessage;
    if (error.code === "ERR_NETWORK") return "Unable to reach the server. Check your connection and try again.";
    if (error.code === "ECONNABORTED") return "The request timed out. Please try again.";
    return fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
