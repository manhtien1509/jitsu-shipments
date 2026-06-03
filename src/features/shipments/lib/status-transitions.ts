import type { ShipmentStatus } from "../types/shipment.types";

/**
 * Finite state machine for shipment status transitions.
 *
 * Each entry maps a status to the list of statuses it can transition TO.
 * Self-transitions are intentionally excluded — they are not real transitions.
 *
 */
const TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  OPEN: ["IN_TRANSIT"],
  IN_TRANSIT: ["OPEN", "DELIVERED"],
  DELIVERED: [],
};

/**
 * Returns the list of statuses `current` can legally transition to.
 * Does NOT include `current` itself.
 */
export function getValidNextStatuses(
  current: ShipmentStatus,
): ShipmentStatus[] {
  return TRANSITIONS[current] ?? [];
}

/**
 * Returns options for a status dropdown: the current status (as the
 * selected/default value) plus all valid next statuses.
 *
 * This is a UI concern — kept separate from the FSM definition above.
 */
export function getStatusDropdownOptions(
  current: ShipmentStatus,
): ShipmentStatus[] {
  return [current, ...getValidNextStatuses(current)];
}

/**
 * Validates a transition request.
 * A no-op (from === to) is considered valid since it changes nothing.
 */
export function isValidTransition(
  from: ShipmentStatus,
  to: ShipmentStatus,
): boolean {
  if (from === to) return true;
  return TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Business rule: IN_TRANSIT shipments must be linked to an assignment.
 */
export function requiresAssignment(status: ShipmentStatus): boolean {
  return status === "IN_TRANSIT";
}
