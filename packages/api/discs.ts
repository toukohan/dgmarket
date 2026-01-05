import api from "./axios";
import type { PublicDisc, CreateDiscInput, UpdateDiscInput, DiscSearchFilters } from "../types/disc";

export interface DiscSearchResponse {
  discs: PublicDisc[];
  total: number;
}

export const discsApi = {
  getAll: async (filters?: DiscSearchFilters): Promise<DiscSearchResponse> => {
    const { data } = await api.get("/discs", { params: filters });
    return data;
  },

  search: async (filters: DiscSearchFilters): Promise<DiscSearchResponse> => {
    const { data } = await api.get("/discs/search", { params: filters });
    return data;
  },

  getById: async (id: number): Promise<PublicDisc> => {
    const { data } = await api.get(`/discs/${id}`);
    return data;
  },

  create: async (discData: CreateDiscInput): Promise<PublicDisc> => {
    const { data } = await api.post("/discs", discData);
    return data;
  },

  getMyDiscs: async (): Promise<PublicDisc[]> => {
    const { data } = await api.get("/discs/seller/my-discs");
    return data;
  },

  update: async (id: number, updates: UpdateDiscInput): Promise<PublicDisc> => {
    const { data } = await api.put(`/discs/${id}`, updates);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/discs/${id}`);
  },
};
