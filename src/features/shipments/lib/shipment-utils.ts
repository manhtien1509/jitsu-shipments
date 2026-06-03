import type { ShipmentStatus } from '../types/shipment.types';

export const STATUS_LABEL: Record<ShipmentStatus, string> = {
  OPEN: 'Open',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
};

export const STATUS_BADGE_VARIANT: Record<
  ShipmentStatus,
  'neutral' | 'warning' | 'success'
> = {
  OPEN: 'neutral',
  IN_TRANSIT: 'warning',
  DELIVERED: 'success',
};

export const STATUS_ORDER: ShipmentStatus[] = [
  'OPEN',
  'IN_TRANSIT',
  'DELIVERED',
];