/** Session state stores public user data only; credentials remain in SecureStore. */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { authApi } from "../api/auth";
import { tokenStorage, cache } from "../utils/storage";
import { AuthResponse, User } from "../types";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = { user: null, isAuthenticated: false, loading: false, error: null, initialized: false };
const CACHED_USER_KEY = "session-user";

async function storeSession(response: AuthResponse): Promise<AuthResponse> {
  await tokenStorage.set(response.accessToken, response.refreshToken);
  await cache.set(CACHED_USER_KEY, response.user);
  return response;
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (body: { email: string; password: string }) => storeSession(await authApi.login(body)),
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (body: { email: string; password: string; name: string; phone?: string }) => storeSession(await authApi.register(body)),
);

export const restoreSession = createAsyncThunk("auth/restore", async () => {
  if (!(await tokenStorage.getAccess())) {
    await cache.remove(CACHED_USER_KEY);
    return null;
  }
  try {
    const user = await authApi.me();
    await cache.set(CACHED_USER_KEY, user);
    return user;
  } catch (error) {
    // Preserve a signed-in offline session when the API cannot be reached. A 401
    // still clears credentials after the interceptor's refresh attempt fails.
    if (axios.isAxiosError(error) && (!error.response || error.response.status >= 500)) {
      return await cache.get<User>(CACHED_USER_KEY);
    }
    await tokenStorage.clear();
    await cache.remove(CACHED_USER_KEY);
    return null;
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const refreshToken = await tokenStorage.getRefresh();
  try {
    await authApi.logout(refreshToken ?? undefined);
  } catch {
    // Local sign-out must succeed when the device is offline or the API is down.
  } finally {
    await tokenStorage.clear();
    await cache.remove(CACHED_USER_KEY);
  }
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionExpired(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.initialized = true;
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.initialized = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
      });
    builder.addMatcher(
      (action) => action.type === loginUser.rejected.type || action.type === registerUser.rejected.type,
      (state, action) => {
        state.loading = false;
        const error = "error" in action ? action.error : undefined;
        state.error = error && typeof error === "object" && "message" in error && typeof error.message === "string"
          ? error.message
          : "Unable to sign in";
      },
    );
  },
});

export const { sessionExpired, updateUser } = slice.actions;
export default slice.reducer;
