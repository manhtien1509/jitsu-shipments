
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { shipmentsApi } from '../api/shipments.api';
import { shipmentKeys } from '../api/shipments.keys';
import type { Shipment } from '../types/shipment.types';

export function useEditShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shipment: Shipment) =>
      shipmentsApi.update(shipment.id, shipment),

    onSuccess: (_, shipment) => {
      queryClient.invalidateQueries({
        queryKey: shipmentKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: shipmentKeys.detail(shipment.id),
      });
    },
  });
}