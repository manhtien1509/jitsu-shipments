import { useQuery } from "@tanstack/react-query";
import { assignmentsApi } from "./assignments.api";
import { assignmentKeys } from "./assignments.keys";

export function useAssignments() {
  return useQuery({
    queryKey: assignmentKeys.list(),
    queryFn: () => assignmentsApi.list(),
  });
}

export function useAssignment(id: string | null | undefined) {
  return useQuery({
    queryKey: assignmentKeys.detail(id ?? ""),
    queryFn: () => assignmentsApi.getById(id!),
    enabled: !!id,
  });
}
