import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/shared/components/layout/PageHeader";
import { TriSplitLayout } from "@/shared/components/layout/TriSplitLayout";

import { AssignmentListPanel } from "@/features/assignments/components/list/AssignmentListPanel";
import { AssignmentDetailPanel } from "@/features/assignments/components/detail/AssignmentDetailPanel";
import { AssignmentShipmentDetailPanel } from "@/features/assignments/components/detail/AssignmentShipmentDetailPanel";

import { useAssignmentsSelection } from "@/features/assignments/pages/hooks/useAssignmentsSelection";
import { useAssignmentsPageDialogs } from "@/features/assignments/pages/hooks/useAssignmentsPageDialogs";
import { useAssignmentsPageActions } from "@/features/assignments/pages/hooks/useAssignmentsPageActions";
import { AssignmentsPageDialogs } from "@/features/assignments/pages/AssignmentsPageDialogs";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { ResponsiveSheet } from "@/shared/components/layout/ResponsiveSheet";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

export function AssignmentsPage() {
  const navigate = useNavigate();
  const { assignmentId, shipmentId, assignments, shipments, selectedShipment } =
    useAssignmentsSelection();

  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");

  const mobileView: "left" | "middle" | "right" = shipmentId
    ? "right"
    : assignmentId
      ? "middle"
      : "left";

  const headerConfig = (() => {
    if (shipmentId && selectedShipment) {
      return {
        title: selectedShipment.label ?? "Shipment",
        subtitle: selectedShipment.client_name,
        showBack: true,
        onBack: () => navigate(`/assignments/${assignmentId}`),
      };
    }
    if (assignmentId) {
      return {
        title: `Assignment ${assignmentId}`,
        showBack: true,
        onBack: () => navigate(`/assignments`),
      };
    }
    return { title: "Assignments", showBack: false };
  })();

  useDocumentTitle(headerConfig.title);

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

  const shipmentDetail = (
    <AssignmentShipmentDetailPanel
      shipment={selectedShipment}
      assignmentShipments={shipments}
      onEdit={openEditShipment}
      onDelete={openDeleteShipment}
    />
  );

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={"Assignments"}
        showBack={headerConfig.showBack}
        onBack={headerConfig.onBack}
      />

      <div className="flex-1 overflow-hidden">
        <TriSplitLayout
          showRight={!!shipmentId}
          mobileView={mobileView}
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
          right={shipmentDetail}
        />
      </div>

      {isTablet && (
        <ResponsiveSheet
          open={!!shipmentId}
          onClose={() =>
            assignmentId && navigate(`/assignments/${assignmentId}`)
          }
          side="right"
          title={selectedShipment?.label}
        >
          {shipmentDetail}
        </ResponsiveSheet>
      )}

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
