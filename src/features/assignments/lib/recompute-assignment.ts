import { assignmentsApi } from "../api/assignments.api";

/**
 * Recompute shipment_count and clients of an assignment based on
 * its current shipments. Source of truth = shipments collection.
 *
 * Idempotent — safe to call multiple times.
 */
export async function recomputeAssignmentStats(assignmentId: string) {
  const shipments = await assignmentsApi.getShipments(assignmentId);

  const clients = Array.from(new Set(shipments.map((s) => s.client_name)));

  return assignmentsApi.patch(assignmentId, {
    shipment_count: shipments.length,
    clients,
  });
}
