import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shipmentsApi } from "./shipments.api";
import { shipmentKeys } from "./shipments.keys";
import { assignmentKeys } from "@/features/assignments/api/assignments.keys";
import { recomputeAssignmentStats } from "@/features/assignments/lib/recompute-assignment";
import type { Shipment, ShipmentUpdate } from "../types/shipment.types";

type EditInput = {
  prev: Pick<Shipment, "id" | "assignment_id">;
  next: ShipmentUpdate;
};

export function useEditShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ prev, next }: EditInput) => {
      const updated = await shipmentsApi.update(prev.id, next);

      // Recompute BOTH old & new assignment if changed
      const prevAid = prev.assignment_id ?? null;
      const nextAid = updated.assignment_id ?? null;

      const toRecompute = new Set<string>();
      if (prevAid) toRecompute.add(prevAid);
      if (nextAid) toRecompute.add(nextAid);

      await Promise.all(Array.from(toRecompute).map(recomputeAssignmentStats));

      return { prev, updated, affectedAssignments: Array.from(toRecompute) };
    },

    onSuccess: ({ updated, affectedAssignments }) => {
      // Shipment caches
      queryClient.setQueryData(shipmentKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });

      // Assignment caches — both old & new
      for (const aid of affectedAssignments) {
        queryClient.invalidateQueries({
          queryKey: assignmentKeys.shipments(aid),
        });
        queryClient.invalidateQueries({
          queryKey: assignmentKeys.detail(aid),
        });
      }

      if (affectedAssignments.length > 0) {
        queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      }
    },
  });
}
