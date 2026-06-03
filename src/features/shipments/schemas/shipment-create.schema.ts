import { z } from 'zod';
import { latSchema, lngSchema, requiredString } from './shipment.primitives';

export const shipmentCreateSchema = z.object({
  client_name: requiredString('Client name'),
  label: requiredString('Label'),
  delivery_by_date: requiredString('Delivery by date'),
  lat: latSchema,
  lng: lngSchema,
});

export type ShipmentCreateFormInput = z.input<typeof shipmentCreateSchema>;

export type ShipmentCreateFormValues = z.output<typeof shipmentCreateSchema>;