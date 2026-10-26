/** Clinic catalog state with stale cache and request ordering protection. */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clinicsApi } from "../api/clinics";
import { Clinic, Page } from "../types";
import { cache } from "../utils/storage";

export type ClinicQuery = Record<string, string | number | undefined>;

export const fetchClinics = createAsyncThunk("clinics/fetch", async (params: ClinicQuery) => {
  const key = `clinics:${JSON.stringify(params)}`;
  try {
    const result = await clinicsApi.list(params);
    if (Number(params.page ?? 1) === 1) await cache.set(key, result);
    return result;
  } catch (error) {
    const saved = Number(params.page ?? 1) === 1 ? await cache.get<Page<Clinic>>(key) : null;
    if (saved) return saved;
    throw error;
  }
});

interface ClinicsState {
  data: Clinic[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  activeRequestId: string | null;
}

const initialState: ClinicsState = { data: [], page: 1, hasMore: true, loading: false, error: null, activeRequestId: null };

const slice = createSlice({
  name: "clinics",
  initialState,
  reducers: {
    resetClinics(state) {
      state.data = [];
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
      state.activeRequestId = null;
    },
    restoreClinics(state, action: PayloadAction<Page<Clinic>>) {
      state.data = action.payload.data;
      state.page = action.payload.page;
      state.hasMore = action.payload.hasMore;
      state.loading = false;
      state.error = null;
      state.activeRequestId = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchClinics.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.activeRequestId = action.meta.requestId;
      })
      .addCase(fetchClinics.fulfilled, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.data = Number(action.meta.arg.page ?? 1) === 1 ? action.payload.data : [...state.data, ...action.payload.data];
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
        state.activeRequestId = null;
      })
      .addCase(fetchClinics.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.error.message ?? "Unable to load clinics.";
        state.activeRequestId = null;
      });
  },
});

export const { resetClinics, restoreClinics } = slice.actions;
export default slice.reducer;
