import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentsApi } from "./assignments.api";
import { assignmentKeys } from "./assignments.keys";
import type { Assignment } from "../types/assignment.types";

export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignment: Assignment) => {
      if (assignment.shipment_count > 0) {
        return Promise.reject(
          new Error("Only empty assignments can be deleted."),
        );
      }
      return assignmentsApi.remove(assignment.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
    },
  });
}
