import { ShipmentCreateDialog } from "@/features/shipments/components/dialogs/ShipmentCreateDialog";
import { ShipmentDetailPanel } from "@/features/shipments/components/detail/ShipmentDetailPanel";
import { ShipmentEditDialog } from "@/features/shipments/components/dialogs/ShipmentEditDialog";
import { ShipmentListPanel } from "@/features/shipments/components/list/ShipmentListPanel";
import { useDeleteShipment } from "@/features/shipments/hooks/useDeleteShipment";
import {
  useShipment,
  useShipments,
} from "@/features/shipments/hooks/useShipments";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { SplitLayout } from "@/shared/components/layout/SplitLayout";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { useState } from "react";
import { toast } from "sonner";
import { useShipmentsStore } from "@/features/shipments/store/shipments.store";

export function ShipmentsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: editing } = useShipment(editingId);
  const { data: deleting } = useShipment(deletingId);

  const { data: shipments } = useShipments();
  const selectedId = useShipmentsStore((s) => s.selectedId);
  const setSelectedId = useShipmentsStore((s) => s.setSelectedId);

  const deleteShipmentMutation = useDeleteShipment();

  const handleDeleteConfirm = async () => {
    if (!deleting) return;

    let nextId: string | null = selectedId;
    if (selectedId === deleting.id && shipments) {
      const idx = shipments.findIndex((s) => s.id === deleting.id);
      nextId = shipments[idx + 1]?.id ?? shipments[idx - 1]?.id ?? null;
    }

    deleteShipmentMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success(`Deleted ${deleting.label}`);
        if (selectedId === deleting.id) setSelectedId(nextId);
        setDeletingId(null);
      },

      onError: () => {
        toast.error("Failed to delete shipment");
      },
    });
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Shipments" />
      <div className="flex-1 min-h-0">
        <SplitLayout
          left={<ShipmentListPanel onCreateClick={() => setCreateOpen(true)} />}
          right={
            <ShipmentDetailPanel
              onEdit={setEditingId}
              onDelete={setDeletingId}
            />
          }
        />
      </div>

      <ShipmentCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <ShipmentEditDialog
        open={!!editingId}
        shipment={editing ?? null}
        onClose={() => setEditingId(null)}
      />
      <ConfirmDialog
        open={!!deletingId}
        title="Delete shipment"
        variant="danger"
        confirmText="Delete"
        loading={deleteShipmentMutation.isPending}
        message={
          deleting ? (
            <>
              Are you sure you want to delete <strong>{deleting.label}</strong>{" "}
              ({deleting.client_name})? This action cannot be undone.
            </>
          ) : null
        }
        onConfirm={handleDeleteConfirm}
        onClose={() => !deleteShipmentMutation.isPending && setDeletingId(null)}
      />
    </div>
  );
}
