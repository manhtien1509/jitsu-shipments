import { api } from '@/shared/lib/axios';
import type {
  Assignment,
  AssignmentCreate,
  AssignmentUpdate,
} from '../types/assignment.types';

export const assignmentsApi = {
  list: async (): Promise<Assignment[]> => {
    const { data } = await api.get<Assignment[]>('/assignments');
    return data;
  },
  getById: async (id: string): Promise<Assignment> => {
    const { data } = await api.get<Assignment>(`/assignments/${id}`);
    return data;
  },
  create: async (payload: AssignmentCreate): Promise<Assignment> => {
    const { data } = await api.post<Assignment>('/assignments', {
      shipment_count: 0,
      ...payload,
    });
    return data;
  },
  update: async (id: string, patch: AssignmentUpdate): Promise<Assignment> => {
    const { data } = await api.patch<Assignment>(`/assignments/${id}`, patch);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/assignments/${id}`);
  },
};