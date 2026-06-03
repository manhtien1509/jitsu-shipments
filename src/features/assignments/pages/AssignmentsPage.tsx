import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { PageHeader } from "@/shared/components/layout/PageHeader";
import { TriSplitLayout } from "@/shared/components/layout/TriSplitLayout";
import { Button } from "@/shared/components/ui";

import { AssignmentListPanel } from "@/features/assignments/components/list/AssignmentListPanel";
import { AssignmentDetailPanel } from "@/features/assignments/components/detail/AssignmentDetailPanel";
import { AssignmentShipmentDetailPanel } from "@/features/assignments/components/detail/AssignmentShipmentDetailPanel";

import { useAssignmentsSelection } from "@/features/assignments/pages/hooks/useAssignmentsSelection";
import { useAssignmentsPageDialogs } from "@/features/assignments/pages/hooks/useAssignmentsPageDialogs";
import { useAssignmentsPageActions } from "@/features/assignments/pages/hooks/useAssignmentsPageActions";
import { AssignmentsPageDialogs } from "@/features/assignments/pages/AssignmentsPageDialogs";

export function AssignmentsPage() {
  const navigate = useNavigate();
  const { assignmentId, shipmentId, assignments, shipments, selectedShipment } =
    useAssignmentsSelection();

  const {
    dialog,
    openCreateAssignment,
    openEditShipment,
    openDeleteAssignment,
    openDeleteShipment,
    close: closeDialog,
  } = useAssignmentsPageDialogs();

  const {
    handleDeleteAssignment,
    handleDeleteShipment,
    isDeletingAssignment,
    isDeletingShipment,
  } = useAssignmentsPageActions({
    assignmentId: assignmentId || undefined,
    shipmentId: shipmentId || undefined,
    onAfterDelete: closeDialog,
  });

  // If URL points to a shipment not in current assignment, redirect
  useEffect(() => {
    if (!shipmentId || !assignmentId || !selectedShipment) return;
    if (selectedShipment.assignment_id !== assignmentId) {
      navigate(`/assignments/${assignmentId}`, { replace: true });
    }
  }, [shipmentId, assignmentId, selectedShipment, navigate]);

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Assignments"
        actions={
          <Button
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={openCreateAssignment}
          >
            New Assignment
          </Button>
        }
      />

      <div className="flex-1 overflow-hidden">
        <TriSplitLayout
          showRight={!!shipmentId}
          left={
            <AssignmentListPanel
              selectedId={assignmentId}
              onSelect={(id) => navigate(`/assignments/${id}`)}
              onCreateClick={openCreateAssignment}
            />
          }
          middle={
            <AssignmentDetailPanel
              assignmentId={assignmentId}
              selectedShipmentId={shipmentId}
              onSelectShipment={(id) =>
                assignmentId &&
                navigate(`/assignments/${assignmentId}/shipments/${id}`)
              }
              onDelete={openDeleteAssignment}
            />
          }
          right={
            <AssignmentShipmentDetailPanel
              shipment={selectedShipment}
              assignmentShipments={shipments}
              onEdit={openEditShipment}
              onDelete={openDeleteShipment}
            />
          }
        />
      </div>

      <AssignmentsPageDialogs
        dialog={dialog}
        assignments={assignments}
        shipments={shipments}
        onClose={closeDialog}
        onCreated={(id) => {
          closeDialog();
          navigate(`/assignments/${id}`);
        }}
        onConfirmDeleteAssignment={handleDeleteAssignment}
        onConfirmDeleteShipment={handleDeleteShipment}
        isDeletingAssignment={isDeletingAssignment}
        isDeletingShipment={isDeletingShipment}
      />
    </div>
  );
}
