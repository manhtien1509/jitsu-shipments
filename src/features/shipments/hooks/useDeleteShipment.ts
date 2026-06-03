import { useMutation, useQueryClient } from '@tanstack/react-query';

import { shipmentsApi } from '../api/shipments.api';
import { shipmentKeys } from '../api/shipments.keys';

export function useDeleteShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shipmentsApi.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shipmentKeys.lists(),
      });
    },
  });
}