/** Clinic favorites API methods. */
import { client } from "./client"; import { Favorite } from "../types";
export const favoritesApi = { list: async () => (await client.get<{ data: Favorite[] }>("/favorites")).data.data, add: async (id: string) => (await client.post<Favorite>(`/favorites/${id}`)).data, remove: async (id: string) => client.delete(`/favorites/${id}`) };
