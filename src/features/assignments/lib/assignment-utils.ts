import type { AssignmentStatus } from "../types/assignment.types";

export const ASSIGNMENT_STATUS_LABEL: Record<AssignmentStatus, string> = {
  OPEN: "Open",
  COMPLETED: "Completed",
};

export const ASSIGNMENT_STATUS_BADGE_VARIANT: Record<
  AssignmentStatus,
  "neutral" | "warning" | "success"
> = {
  OPEN: "warning",
  COMPLETED: "success",
};

export const ASSIGNMENT_STATUS_ORDER: AssignmentStatus[] = [
  "OPEN",
  "COMPLETED",
];

export function canDeleteAssignment(a: { shipment_count: number }) {
  return a.shipment_count === 0;
}
