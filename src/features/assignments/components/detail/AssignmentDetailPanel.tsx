import { Route } from "lucide-react";
import { EmptyState, SkeletonRow } from "@/shared/components/ui";
import { useAssignment } from "@/features/assignments/api/useAssignments";
import { useAssignmentShipments } from "@/features/assignments/api/useAssignmentShipments";
import { AssignmentDetailHeader } from "./AssignmentDetailHeader";
import { AssignmentInfoSection } from "./AssignmentInfoSection";
import { AssignmentShipmentsList } from "./AssignmentShipmentsList";

interface Props {
  assignmentId: string | null;
  selectedShipmentId: string | null;
  onSelectShipment: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AssignmentDetailPanel({
  assignmentId,
  selectedShipmentId,
  onSelectShipment,
  onDelete,
}: Props) {
  const { data: assignment, isLoading, isError } = useAssignment(assignmentId);
  const { data: shipments, isLoading: shipmentsLoading } =
    useAssignmentShipments(assignmentId);

  if (!assignmentId) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={<Route className="h-8 w-8" />}
          title="No assignment selected"
          description="Choose an assignment from the list."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    );
  }

  if (isError || !assignment) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={<Route className="h-8 w-8" />}
          title="Failed to load assignment"
          description="Something went wrong."
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <AssignmentDetailHeader
        assignment={assignment}
        onDelete={() => onDelete(assignment.id)}
      />

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <AssignmentInfoSection assignment={assignment} />

        <div>
          <h3 className="mb-2 text-sm font-semibold text-neutral-900">
            Shipments ({assignment.shipment_count})
          </h3>
          <AssignmentShipmentsList
            shipments={shipments}
            isLoading={shipmentsLoading}
            selectedId={selectedShipmentId}
            onSelect={onSelectShipment}
          />
        </div>
      </div>
    </div>
  );
}
