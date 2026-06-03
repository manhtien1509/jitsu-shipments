import { useState } from "react";
import { toast } from "sonner";
import type { Shipment } from "@/features/shipments/types/shipment.types";
import { useShipments } from "../../api/useShipments";
import { useShipmentsStore } from "../../store/shipments.store";
import { useDeleteShipment } from "../../api/useDeleteShipment";

export function useDeleteShipmentHandler() {
  const [deletingShipment, setDeletingShipment] = useState<Shipment | null>(
    null,
  );

  const { data: shipments } = useShipments();
  const selectedId = useShipmentsStore((s) => s.selectedId);
  const setSelectedId = useShipmentsStore((s) => s.setSelectedId);

  const deleteShipmentMutation = useDeleteShipment();

  const handleDeleteConfirm = () => {
    if (!deletingShipment) return;

    let nextId: string | null = selectedId;
    if (selectedId === deletingShipment.id && shipments) {
      const idx = shipments.findIndex((s) => s.id === deletingShipment.id);
      nextId = shipments[idx + 1]?.id ?? shipments[idx - 1]?.id ?? null;
    }

    deleteShipmentMutation.mutate(deletingShipment, {
      onSuccess: () => {
        toast.success(`Deleted ${deletingShipment.label}`);
        if (selectedId === deletingShipment.id) setSelectedId(nextId);
        setDeletingShipment(null);
      },
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Failed to delete shipment",
        ),
    });
  };

  const handleDeleteClose = () => {
    if (!deleteShipmentMutation.isPending) setDeletingShipment(null);
  };

  return {
    deletingShipment,
    setDeletingShipment,
    isDeleting: deleteShipmentMutation.isPending,
    handleDeleteConfirm,
    handleDeleteClose,
  };
}
