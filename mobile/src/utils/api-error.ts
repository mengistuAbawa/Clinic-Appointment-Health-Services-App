/** Converts API/network errors into a message that can be shown to a patient. */
import { apiMessage } from "../api/client";

export function normalizeApiError(error: unknown, fallback?: string): string {
  return apiMessage(error, fallback);
}
