import { useQuery } from '@tanstack/react-query';
import { shipmentsApi } from '../api/shipments.api';
import { shipmentKeys } from '../api/shipments.keys';

export function useShipments() {
  return useQuery({
    queryKey: shipmentKeys.list(),
    queryFn: () => shipmentsApi.list(),
  });
}

export function useShipment(id: string | null) {
  return useQuery({
    queryKey: shipmentKeys.detail(id ?? ''),
    queryFn: () => shipmentsApi.getById(id!),
    enabled: !!id,
  });
}