import { z } from "zod";
import {
  latSchema,
  lngSchema,
  requiredString,
  statusSchema,
} from "./shipment.primitives";
import { requiresAssignment } from "../lib/status-transitions";

export const shipmentEditSchema = z
  .object({
    arrival_date: z.string(),
    delivery_by_date: requiredString("Delivery by date"),
    lat: latSchema,
    lng: lngSchema,
    status: statusSchema,
    assignment_id: z.string().nullable(),
  })
  .superRefine((d, ctx) => {
    const delivery = new Date(d.delivery_by_date);
    const arrival = new Date(d.arrival_date);
    if (delivery.getTime() < arrival.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Delivery date must be on or after arrival date",
        path: ["delivery_by_date"],
      });
    }

    if (requiresAssignment(d.status) && !d.assignment_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Assignment is required when status is IN_TRANSIT",
        path: ["assignment_id"],
      });
    }
  });

export type ShipmentEditFormInput = z.input<typeof shipmentEditSchema>;
export type ShipmentEditFormValues = z.output<typeof shipmentEditSchema>;
