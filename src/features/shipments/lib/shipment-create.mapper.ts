import { fromDateInputValue } from '@/shared/lib/date';
import type { ShipmentCreate } from '../types/shipment.types';
import type { ShipmentCreateFormValues } from '../schemas/shipment-create.schema';

const DEFAULT_WAREHOUSE_ID = '581';

export function buildShipmentCreatePayload(
  values: ShipmentCreateFormValues,
): ShipmentCreate {
  const deliveryByDateISO = fromDateInputValue(values.delivery_by_date);

  return {
    client_name: values.client_name,
    label: values.label,
    lat: values.lat,
    lng: values.lng,
    delivery_by_date: deliveryByDateISO,

    // Defaults
    status: 'OPEN',
    assignment_id: null,
    arrival_date: new Date().toISOString(),
    warehouse_id: DEFAULT_WAREHOUSE_ID,
    eta: deliveryByDateISO,
  };
}