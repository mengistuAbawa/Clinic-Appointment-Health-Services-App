/** Redux store configuration and strongly typed dispatch/state helpers. */
import { configureStore } from "@reduxjs/toolkit"; import auth from "./authSlice"; import clinics from "./clinicsSlice"; import appointments from "./appointmentsSlice"; import favorites from "./favoritesSlice";
export const store = configureStore({ reducer: { auth, clinics, appointments, favorites } }); export type RootState = ReturnType<typeof store.getState>; export type AppDispatch = typeof store.dispatch;
