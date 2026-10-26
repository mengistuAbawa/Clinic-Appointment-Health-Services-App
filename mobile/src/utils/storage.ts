/** Secure credential storage and typed AsyncStorage cache helpers. */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "clinic.access-token";
const REFRESH_TOKEN_KEY = "clinic.refresh-token";
const CACHE_PREFIX = "clinic.cache.";

export const tokenStorage = {
  getAccess: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  getRefresh: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  async set(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      await this.clear();
      throw error;
    }
  },
  setAccess: (accessToken: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
  async clear(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const storageKey = `${CACHE_PREFIX}${key}`;
    let raw: string | null;
    try {
      raw = await AsyncStorage.getItem(storageKey);
    } catch {
      return null;
    }
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      try { await AsyncStorage.removeItem(storageKey); } catch { /* Cache corruption must not block the screen. */ }
      return null;
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    try { await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(value)); } catch { /* API success must not depend on optional caching. */ }
  },
  async remove(key: string): Promise<void> {
    try { await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`); } catch { /* Cache cleanup is best-effort. */ }
  },
};
