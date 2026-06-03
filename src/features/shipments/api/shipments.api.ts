import { api } from "@/shared/lib/axios";
import type {
  Shipment,
  ShipmentCreate,
  ShipmentUpdate,
} from "../types/shipment.types";

export const shipmentsApi = {
  list: async (): Promise<Shipment[]> => {
    const { data } = await api.get<Shipment[]>("/shipments");
    return data;
  },

  getById: async (id: string): Promise<Shipment> => {
    const { data } = await api.get<Shipment>(`/shipments/${id}`);
    return data;
  },

  update: async (id: string, payload: ShipmentUpdate): Promise<Shipment> => {
    const { data } = await api.patch<Shipment>(`/shipments/${id}`, payload);
    return data;
  },

  create: async (payload: ShipmentCreate): Promise<Shipment> => {
    const { data } = await api.post<Shipment>("/shipments", payload);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/shipments/${id}`);
  },
};
