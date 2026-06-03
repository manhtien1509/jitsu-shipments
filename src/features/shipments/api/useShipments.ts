import { useQuery } from "@tanstack/react-query";
import { shipmentsApi } from "./shipments.api";
import { shipmentKeys } from "./shipments.keys";

export function useShipments() {
  return useQuery({
    queryKey: shipmentKeys.list(),
    queryFn: () => shipmentsApi.list(),
  });
}

export function useShipment(id: string | null) {
  return useQuery({
    queryKey: id ? shipmentKeys.detail(id) : ["shipment", "disabled"],
    queryFn: () => shipmentsApi.getById(id!),
    enabled: !!id,
  });
}
