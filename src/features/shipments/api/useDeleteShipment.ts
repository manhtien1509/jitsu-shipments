import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shipmentsApi } from "./shipments.api";
import { shipmentKeys } from "./shipments.keys";
import { assignmentKeys } from "@/features/assignments/api/assignments.keys";
import { recomputeAssignmentStats } from "@/features/assignments/lib/recompute-assignment";
import type { Shipment } from "../types/shipment.types";

type DeleteInput = Pick<Shipment, "id" | "assignment_id">;

export function useDeleteShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shipment: DeleteInput) => {
      const assignmentId = shipment.assignment_id ?? null;

      await shipmentsApi.remove(shipment.id);

      if (assignmentId) {
        await recomputeAssignmentStats(assignmentId);
      }

      return { id: shipment.id, assignmentId };
    },

    onSuccess: ({ id, assignmentId }) => {
      // Shipment caches
      queryClient.removeQueries({ queryKey: shipmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });

      // Assignment caches (if shipment belonged to one)
      if (assignmentId) {
        queryClient.invalidateQueries({
          queryKey: assignmentKeys.shipments(assignmentId),
        });
        queryClient.invalidateQueries({
          queryKey: assignmentKeys.detail(assignmentId),
        });
        queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      }
    },
  });
}
