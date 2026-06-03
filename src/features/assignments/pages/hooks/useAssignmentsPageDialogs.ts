import { useState } from "react";

// Single source of truth for "what dialog is open"
// Mutually exclusive — can't open two at once anyway
export type DialogState =
  | { type: "none" }
  | { type: "create-assignment" }
  | { type: "edit-shipment"; shipmentId: string }
  | { type: "delete-assignment"; assignmentId: string }
  | { type: "delete-shipment"; shipmentId: string };

export function useAssignmentsPageDialogs() {
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });
  const close = () => setDialog({ type: "none" });

  return {
    dialog,
    openCreateAssignment: () => setDialog({ type: "create-assignment" }),
    openEditShipment: (shipmentId: string) =>
      setDialog({ type: "edit-shipment", shipmentId }),
    openDeleteAssignment: (assignmentId: string) =>
      setDialog({ type: "delete-assignment", assignmentId }),
    openDeleteShipment: (shipmentId: string) =>
      setDialog({ type: "delete-shipment", shipmentId }),
    close,
  };
}
