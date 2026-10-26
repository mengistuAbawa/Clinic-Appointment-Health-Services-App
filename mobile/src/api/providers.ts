/** Provider profile and availability API methods. */
import { client } from "./client";
import { Provider, Slot } from "../types";

export const providersApi = {
  getById: async (id: string) => (await client.get<Provider>(`/providers/${id}`)).data,
  getSlots: async (id: string, date: string) =>
    (await client.get<{ data: Slot[] }>(`/providers/${id}/slots`, { params: { date } })).data.data,
};
