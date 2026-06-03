import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDeleteShipment } from "@/features/shipments/api/useDeleteShipment";
import { useEditShipment } from "@/features/shipments/api/useEditShipment";
import type {
  Shipment,
  ShipmentUpdate,
} from "@/features/shipments/types/shipment.types";
import type { Assignment } from "@/features/assignments/types/assignment.types";
import { useDeleteAssignment } from "@/features/assignments/api/useDeleteAssignment";

type Args = {
  assignmentId?: string;
  shipmentId?: string;
  onAfterDelete: () => void;
};

export function useAssignmentsPageActions({
  assignmentId,
  shipmentId,
  onAfterDelete,
}: Args) {
  const navigate = useNavigate();
  const deleteAssignment = useDeleteAssignment();
  const deleteShipment = useDeleteShipment();
  const editShipment = useEditShipment();

  const handleDeleteAssignment = (assignment: Assignment) => {
    deleteAssignment.mutate(assignment, {
      onSuccess: () => {
        toast.success(`Deleted ${assignment.label}`);

        onAfterDelete();

        if (assignmentId === assignment.id) {
          navigate("/assignments", { replace: true });
        }
      },
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Failed to delete assignment",
        ),
    });
  };

  const handleDeleteShipment = (target: Shipment) => {
    deleteShipment.mutate(target, {
      onSuccess: () => {
        toast.success(`Deleted ${target.label}`);
        onAfterDelete();

        if (shipmentId === target.id && assignmentId) {
          navigate(`/assignments/${assignmentId}`, { replace: true });
        }
      },
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Failed to delete shipment",
        ),
    });
  };

  const handleEditShipment = (prev: Shipment, next: ShipmentUpdate) => {
    editShipment.mutate(
      { prev, next },
      {
        onSuccess: ({ updated }) => {
          toast.success(`Updated ${updated.label}`);
        },
        onError: (err) =>
          toast.error(
            err instanceof Error ? err.message : "Failed to update shipment",
          ),
      },
    );
  };

  return {
    handleDeleteAssignment,
    handleDeleteShipment,
    handleEditShipment,
    isDeletingShipment: deleteShipment.isPending,
    isDeletingAssignment: deleteAssignment.isPending,
    isEditing: editShipment.isPending,
  };
}
