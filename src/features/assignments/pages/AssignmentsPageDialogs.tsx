import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { AssignmentCreateDialog } from "@/features/assignments/components/dialogs/AssignmentCreateDialog";
import { ShipmentEditDialog } from "@/features/shipments/components/dialogs/ShipmentEditDialog";
import type { DialogState } from "./hooks/useAssignmentsPageDialogs";
import type { Assignment } from "../types/assignment.types";
import type { Shipment } from "@/features/shipments";

type Props = {
  dialog: DialogState;
  assignments: Assignment[];
  shipments: Shipment[];
  onClose: () => void;
  onCreated: (assignmentId: string) => void;
  onConfirmDeleteAssignment: (a: Assignment) => void;
  onConfirmDeleteShipment: (s: Shipment) => void;
  isDeletingAssignment: boolean;
  isDeletingShipment: boolean;
};

export function AssignmentsPageDialogs({
  dialog,
  assignments,
  shipments,
  onClose,
  onCreated,
  onConfirmDeleteAssignment,
  onConfirmDeleteShipment,
  isDeletingAssignment,
  isDeletingShipment,
}: Props) {
  // Resolve targets from dialog state
  const editingShipment =
    dialog.type === "edit-shipment"
      ? (shipments.find((s) => s.id === dialog.shipmentId) ?? null)
      : null;

  const deletingAssignment =
    dialog.type === "delete-assignment"
      ? (assignments.find((a) => a.id === dialog.assignmentId) ?? null)
      : null;

  const deletingShipment =
    dialog.type === "delete-shipment"
      ? (shipments.find((s) => s.id === dialog.shipmentId) ?? null)
      : null;

  return (
    <>
      <AssignmentCreateDialog
        open={dialog.type === "create-assignment"}
        onClose={onClose}
        onCreated={onCreated}
      />

      <ShipmentEditDialog
        shipment={editingShipment}
        open={!!editingShipment}
        onClose={onClose}
      />

      <ConfirmDialog
        open={!!deletingAssignment}
        title="Delete assignment?"
        variant="danger"
        confirmText="Delete"
        loading={isDeletingAssignment}
        message={
          deletingAssignment && (
            <p>
              Are you sure you want to delete{" "}
              <strong>{deletingAssignment.label}</strong>? This action cannot be
              undone.
            </p>
          )
        }
        onConfirm={() =>
          deletingAssignment && onConfirmDeleteAssignment(deletingAssignment)
        }
        onClose={() => !isDeletingAssignment && onClose()}
      />

      <ConfirmDialog
        open={!!deletingShipment}
        title="Delete shipment?"
        variant="danger"
        confirmText="Delete"
        loading={isDeletingShipment}
        message={
          deletingShipment && (
            <p>
              Are you sure you want to delete{" "}
              <strong>{deletingShipment.label}</strong> (
              {deletingShipment.client_name})?
            </p>
          )
        }
        onConfirm={() =>
          deletingShipment && onConfirmDeleteShipment(deletingShipment)
        }
        onClose={() => !isDeletingShipment && onClose()}
      />
    </>
  );
}
