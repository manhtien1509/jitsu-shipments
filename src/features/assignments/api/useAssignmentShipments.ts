import { useQuery } from "@tanstack/react-query";
import { assignmentsApi } from "./assignments.api";
import { assignmentKeys } from "./assignments.keys";

export function useAssignmentShipments(
  assignmentId: string | null | undefined,
) {
  return useQuery({
    queryKey: assignmentKeys.shipments(assignmentId ?? ""),
    queryFn: () => assignmentsApi.getShipments(assignmentId!),
    enabled: !!assignmentId,
  });
}
