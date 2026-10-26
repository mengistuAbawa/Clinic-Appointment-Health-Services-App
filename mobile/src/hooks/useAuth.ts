/** Small auth facade for screens and the guarded Expo Router layout. */
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { loginUser, logoutUser, registerUser } from "../store/authSlice";
export function useAuth() { const dispatch = useDispatch<AppDispatch>(); const auth = useSelector((s: RootState) => s.auth); return { ...auth, login: useCallback((values: { email: string; password: string }) => dispatch(loginUser(values)).unwrap(), [dispatch]), register: useCallback((values: { email: string; password: string; name: string; phone?: string }) => dispatch(registerUser(values)).unwrap(), [dispatch]), logout: useCallback(() => dispatch(logoutUser()), [dispatch]) }; }
