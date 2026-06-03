import type { Shipment } from "@/features/shipments/types/shipment.types";
import { ShipmentCreateDialog } from "../components/dialogs/ShipmentCreateDialog";
import { ShipmentEditDialog } from "../components/dialogs/ShipmentEditDialog";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";

interface ShipmentsPageDialogsProps {
  createOpen: boolean;
  onCreateClose: () => void;

  editingShipment: Shipment | null;
  onEditClose: () => void;

  deletingShipment: Shipment | null;
  isDeleting: boolean;
  onDeleteConfirm: () => void;
  onDeleteClose: () => void;
}

export function ShipmentsPageDialogs({
  createOpen,
  onCreateClose,
  editingShipment,
  onEditClose,
  deletingShipment,
  isDeleting,
  onDeleteConfirm,
  onDeleteClose,
}: ShipmentsPageDialogsProps) {
  return (
    <>
      <ShipmentCreateDialog open={createOpen} onClose={onCreateClose} />

      <ShipmentEditDialog
        open={!!editingShipment}
        shipment={editingShipment}
        onClose={onEditClose}
      />

      <ConfirmDialog
        open={!!deletingShipment}
        title="Delete shipment?"
        variant="danger"
        confirmText="Delete"
        loading={isDeleting}
        message={
          deletingShipment && (
            <>
              Are you sure you want to delete{" "}
              <strong>{deletingShipment.label}</strong> (
              {deletingShipment.client_name})? This action cannot be undone.
            </>
          )
        }
        onConfirm={onDeleteConfirm}
        onClose={onDeleteClose}
      />
    </>
  );
}
