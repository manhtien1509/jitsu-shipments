import { api } from "@/shared/lib/axios";
import type { Shipment } from "@/features/shipments/types/shipment.types";
import type { Assignment, AssignmentCreate } from "../types/assignment.types";

export const assignmentsApi = {
  list: async (): Promise<Assignment[]> => {
    const { data } = await api.get<Assignment[]>("/assignments");
    return data;
  },

  getById: async (id: string): Promise<Assignment> => {
    const { data } = await api.get<Assignment>(`/assignments/${id}`);
    return data;
  },

  getShipments: async (id: string): Promise<Shipment[]> => {
    const { data } = await api.get<Shipment[]>("/shipments", {
      params: { assignment_id: id },
    });
    return data;
  },

  create: async (payload: AssignmentCreate): Promise<Assignment> => {
    const body: AssignmentCreate = {
      ...payload,
      clients: payload.clients ?? [],
      shipment_count: payload.shipment_count ?? 0,
    };
    const { data } = await api.post<Assignment>("/assignments", body);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/assignments/${id}`);
  },

  patch: async (
    id: string,
    patch: Partial<Pick<Assignment, "shipment_count" | "clients">>,
  ): Promise<Assignment> => {
    const { data } = await api.patch(`/assignments/${id}`, patch);
    return data;
  },
};
