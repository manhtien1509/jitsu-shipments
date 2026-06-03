import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { useAssignments } from "@/features/assignments/api/useAssignments";
import { useAssignmentShipments } from "@/features/assignments/api/useAssignmentShipments";

/**
 * Reads selection from URL and resolves to actual objects.
 * Avoids fetching shipment detail — list is the source of truth.
 */
export function useAssignmentsSelection() {
  const params = useParams<{ assignmentId?: string; shipmentId?: string }>();
  const assignmentId = params.assignmentId ?? null;
  const shipmentId = params.shipmentId ?? null;

  const { data: assignments = [] } = useAssignments();
  const { data: shipments = [] } = useAssignmentShipments(assignmentId);

  const selectedAssignment = useMemo(
    () => assignments.find((a) => a.id === assignmentId) ?? null,
    [assignments, assignmentId],
  );

  const selectedShipment = useMemo(
    () => shipments.find((s) => s.id === shipmentId) ?? null,
    [shipments, shipmentId],
  );

  return {
    assignmentId,
    shipmentId,
    assignments,
    shipments,
    selectedAssignment,
    selectedShipment,
  };
}
