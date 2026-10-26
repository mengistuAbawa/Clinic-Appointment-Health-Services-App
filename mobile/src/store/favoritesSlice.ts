/** Favorite list state with optimistic mutations and reliable rollback. */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { favoritesApi } from "../api/favorites";
import { apiMessage } from "../api/client";
import { Clinic, Favorite } from "../types";

interface FavoritesState {
  data: Favorite[];
  loading: boolean;
  error: string | null;
  optimisticBefore: Record<string, Favorite | null>;
}

const initialState: FavoritesState = { data: [], loading: false, error: null, optimisticBefore: {} };

export const fetchFavorites = createAsyncThunk("favorites/fetch", async () => favoritesApi.list());

export const toggleFavorite = createAsyncThunk(
  "favorites/toggle",
  async (clinic: Clinic, { getState, rejectWithValue }) => {
    const state = getState() as { favorites: FavoritesState };
    const existing = state.favorites.data.some((favorite) => favorite.clinicId === clinic.id);
    try {
      if (existing) {
        await favoritesApi.remove(clinic.id);
        return { clinicId: clinic.id, favorite: null };
      }
      return { clinicId: clinic.id, favorite: await favoritesApi.add(clinic.id) };
    } catch (error) {
      return rejectWithValue(apiMessage(error, "Unable to update this saved clinic."));
    }
  },
  {
    condition: (clinic, { getState }) => {
      const state = (getState() as { favorites: FavoritesState }).favorites;
      return !Object.prototype.hasOwnProperty.call(state.optimisticBefore, clinic.id);
    },
  },
);

const slice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    replaceFavorites(state, action: PayloadAction<Favorite[]>) { state.data = action.payload; },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFavorites.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFavorites.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchFavorites.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? "Unable to load favorites."; })
      .addCase(toggleFavorite.pending, (state, action) => {
        const clinic = action.meta.arg;
        const index = state.data.findIndex((favorite) => favorite.clinicId === clinic.id);
        state.optimisticBefore[clinic.id] = index >= 0 ? state.data[index] : null;
        if (index >= 0) state.data.splice(index, 1);
        else state.data.unshift({ id: `pending-${clinic.id}`, clinicId: clinic.id, userId: "", clinic });
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.data = state.data.filter((favorite) => favorite.clinicId !== action.payload.clinicId);
        if (action.payload.favorite) state.data.unshift(action.payload.favorite);
        delete state.optimisticBefore[action.payload.clinicId];
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        const clinic = action.meta.arg;
        const previous = state.optimisticBefore[clinic.id];
        state.data = state.data.filter((favorite) => favorite.clinicId !== clinic.id);
        if (previous) state.data.unshift(previous);
        delete state.optimisticBefore[clinic.id];
        state.error = typeof action.payload === "string" ? action.payload : action.error.message ?? "Unable to update this saved clinic.";
      });
  },
});

export const { replaceFavorites } = slice.actions;
export default slice.reducer;
