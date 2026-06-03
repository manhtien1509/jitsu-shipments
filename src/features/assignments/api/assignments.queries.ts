import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from './assignments.api';
import { assignmentKeys } from './assignments.keys';
import type {
  Assignment,
  AssignmentCreate,
  AssignmentUpdate,
} from '../types/assignment.types';

export function useAssignmentsQuery() {
  return useQuery({
    queryKey: assignmentKeys.list(),
    queryFn: assignmentsApi.list,
  });
}

export function useAssignmentQuery(id: string | null) {
  return useQuery({
    queryKey: assignmentKeys.detail(id ?? ''),
    queryFn: () => assignmentsApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateAssignmentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignmentCreate) => assignmentsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: assignmentKeys.lists() }),
  });
}

export function useUpdateAssignmentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: AssignmentUpdate }) =>
      assignmentsApi.update(id, patch),
    onSuccess: (updated) => {
      qc.setQueryData(assignmentKeys.detail(updated.id), updated);
      qc.setQueryData<Assignment[]>(assignmentKeys.list(), (old) =>
        old?.map((a) => (a.id === updated.id ? updated : a)),
      );
    },
  });
}

export function useDeleteAssignmentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => assignmentsApi.remove(id),
    onSuccess: (_, id) => {
      qc.setQueryData<Assignment[]>(assignmentKeys.list(), (old) =>
        old?.filter((a) => a.id !== id),
      );
      qc.removeQueries({ queryKey: assignmentKeys.detail(id) });
    },
  });
}