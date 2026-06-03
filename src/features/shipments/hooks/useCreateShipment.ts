import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShipmentCreate } from "../types/shipment.types";
import { shipmentsApi } from "../api/shipments.api";
import { shipmentKeys } from "../api/shipments.keys";

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ShipmentCreate) => shipmentsApi.create(payload),

    onSuccess: (created) => {
      queryClient.setQueryData(shipmentKeys.detail(created.id), created);
      queryClient.invalidateQueries({
        queryKey: shipmentKeys.lists(),
      });
    },
  });
}
