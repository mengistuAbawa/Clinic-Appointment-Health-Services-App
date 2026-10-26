/** Patient profile update and account deletion API methods. */
import { client } from "./client"; import { User } from "../types";
export const usersApi = { update: async (body: { name?: string; phone?: string; avatarUrl?: string }) => (await client.put<User>("/users/me", body)).data, remove: async () => client.delete("/users/me") };
