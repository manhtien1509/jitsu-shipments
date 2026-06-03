// src/features/shipments/api/useEditShipment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shipmentsApi } from "./shipments.api";
import { shipmentKeys } from "./shipments.keys";
import { assignmentKeys } from "@/features/assignments/api/assignments.keys";
import { recomputeAssignmentStats } from "@/features/assignments/lib/recompute-assignment";
import { diffAssignmentImpact } from "../lib/shipment-cache";
import type { Shipment, ShipmentUpdate } from "../types/shipment.types";

type EditInput = {
  prev: Pick<Shipment, "id" | "assignment_id">;
  next: ShipmentUpdate;
};

type EditResult = {
  updated: Shipment;
  affectedAssignments: string[];
};

type MutationContext = {
  previousShipment: Shipment | undefined;
  previousList: Shipment[] | undefined;
};

export function useEditShipment() {
  const queryClient = useQueryClient();

  return useMutation<EditResult, Error, EditInput, MutationContext>({
    mutationFn: async ({ prev, next }) => {
      const updated = await shipmentsApi.update(prev.id, next);

      const { toRecompute } = diffAssignmentImpact(
        prev.assignment_id,
        updated.assignment_id,
      );

      await Promise.all(toRecompute.map(recomputeAssignmentStats));

      return { updated, affectedAssignments: toRecompute };
    },

    /**
     * Optimistic update: immediately reflect changes in the cache so the UI
     * feels instant. Reserved for "field edits" (delivery_by_date, lat, lng)
     * which are the most frequent and lowest-risk mutations.
     *
     * If the request fails, `onError` rolls back to the snapshot taken here.
     */
    onMutate: async ({ prev, next }) => {
      // Cancel any in-flight queries so they don't overwrite our optimistic data
      await queryClient.cancelQueries({
        queryKey: shipmentKeys.detail(prev.id),
      });
      await queryClient.cancelQueries({ queryKey: shipmentKeys.lists() });

      // Snapshot current cache values for rollback (explicit generics so
      // TypeScript knows the shape — query keys don't carry type info)
      const previousShipment = queryClient.getQueryData<Shipment>(
        shipmentKeys.detail(prev.id),
      );
      const previousList = queryClient.getQueryData<Shipment[]>(
        shipmentKeys.list(),
      );

      // Apply optimistic update to detail cache
      if (previousShipment) {
        queryClient.setQueryData<Shipment>(shipmentKeys.detail(prev.id), {
          ...previousShipment,
          ...next,
        });
      }

      // Apply optimistic update to list cache
      if (previousList) {
        queryClient.setQueryData<Shipment[]>(
          shipmentKeys.list(),
          previousList.map((s) => (s.id === prev.id ? { ...s, ...next } : s)),
        );
      }

      return { previousShipment, previousList };
    },

    onError: (_err, { prev }, context) => {
      // Rollback: restore the pre-mutation cache snapshots
      if (context?.previousShipment) {
        queryClient.setQueryData<Shipment>(
          shipmentKeys.detail(prev.id),
          context.previousShipment,
        );
      }
      if (context?.previousList) {
        queryClient.setQueryData<Shipment[]>(
          shipmentKeys.list(),
          context.previousList,
        );
      }
    },

    onSuccess: ({ updated, affectedAssignments }) => {
      // Replace optimistic data with the server's authoritative response
      queryClient.setQueryData<Shipment>(
        shipmentKeys.detail(updated.id),
        updated,
      );

      // Invalidate assignment caches (both old and new) so derived
      // counts/clients are refetched
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

    onSettled: (_data, _err, { prev }) => {
      // Always reconcile with the server after the mutation completes,
      // regardless of success/failure
      queryClient.invalidateQueries({
        queryKey: shipmentKeys.detail(prev.id),
      });
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
    },
  });
}
