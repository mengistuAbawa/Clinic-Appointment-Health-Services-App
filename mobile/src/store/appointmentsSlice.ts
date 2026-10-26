/** Appointment history state with cached pages and request ordering protection. */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appointmentsApi } from "../api/appointments";
import { Appointment, Page } from "../types";
import { cache } from "../utils/storage";

export type AppointmentStatusFilter = "upcoming" | "past";
export interface AppointmentQuery { status: AppointmentStatusFilter; page: number; }

export const fetchAppointments = createAsyncThunk("appointments/fetch", async ({ status, page }: AppointmentQuery) => {
  const key = `appointments:${status}`;
  try {
    const result = await appointmentsApi.list({ status, page });
    if (page === 1) await cache.set(key, result);
    return result;
  } catch (error) {
    const saved = page === 1 ? await cache.get<Page<Appointment>>(key) : null;
    if (saved) return saved;
    throw error;
  }
});

interface AppointmentsState {
  data: Appointment[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  activeRequestId: string | null;
}

const initialState: AppointmentsState = { data: [], page: 1, hasMore: true, loading: false, error: null, activeRequestId: null };

const slice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    restoreAppointments(state, action: PayloadAction<Page<Appointment>>) {
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
      .addCase(fetchAppointments.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.activeRequestId = action.meta.requestId;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.data = action.meta.arg.page === 1 ? action.payload.data : [...state.data, ...action.payload.data];
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
        state.activeRequestId = null;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.error.message ?? "Unable to load appointments.";
        state.activeRequestId = null;
      });
  },
});

export const { restoreAppointments } = slice.actions;
export default slice.reducer;
