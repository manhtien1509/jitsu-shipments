import type { ShipmentStatus } from '../types/shipment.types';

const TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  OPEN: ['OPEN', 'IN_TRANSIT'],
  IN_TRANSIT: ['IN_TRANSIT', 'OPEN', 'DELIVERED'],
  DELIVERED: ['DELIVERED'],
};

export function getValidNextStatuses(current: ShipmentStatus): ShipmentStatus[] {
  return TRANSITIONS[current] ?? [current];
}

export function isValidTransition(
  from: ShipmentStatus,
  to: ShipmentStatus,
): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function requiresAssignment(status: ShipmentStatus): boolean {
  return status === 'IN_TRANSIT';
}