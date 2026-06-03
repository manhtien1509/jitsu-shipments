import { z } from "zod";
import { requiredString } from "@/features/shipments/schemas/shipment.primitives";

export const assignmentCreateSchema = z.object({
  label: requiredString("Label"),
});

export type AssignmentCreateFormInput = z.input<typeof assignmentCreateSchema>;
export type AssignmentCreateFormValues = z.output<
  typeof assignmentCreateSchema
>;
