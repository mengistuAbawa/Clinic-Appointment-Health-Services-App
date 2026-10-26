/** Authentication API methods. */
import { client } from "./client"; import { AuthResponse, User } from "../types";
export const authApi = { login: async (body: { email: string; password: string }) => (await client.post<AuthResponse>("/auth/login", body)).data, register: async (body: { email: string; password: string; name: string; phone?: string }) => (await client.post<AuthResponse>("/auth/register", body)).data, logout: async (refreshToken?: string) => client.post("/auth/logout", { refreshToken }), me: async () => (await client.get<User>("/users/me")).data };
