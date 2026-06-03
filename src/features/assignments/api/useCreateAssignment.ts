import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentsApi } from "./assignments.api";
import { assignmentKeys } from "./assignments.keys";
import type { AssignmentCreate } from "../types/assignment.types";

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignmentCreate) => assignmentsApi.create(payload),
    onSuccess: (created) => {
      queryClient.setQueryData(assignmentKeys.detail(created.id), created);
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
    },
  });
}
