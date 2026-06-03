import { z } from "zod";

export const requiredString = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

const coordSchema = (label: string, min: number, max: number) =>
  z
    .union([z.string(), z.number()])
    .superRefine((val, ctx) => {
      if (val === "" || val === null || val === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} is required`,
        });
        return;
      }
      const num = Number(val);
      if (Number.isNaN(num)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} must be a number`,
        });
        return;
      }
      if (num < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} must be ≥ ${min}`,
        });
      }
      if (num > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} must be ≤ ${max}`,
        });
      }
    })
    .transform((val) => Number(val));

export const latSchema = coordSchema("Latitude", -90, 90);
export const lngSchema = coordSchema("Longitude", -180, 180);

export const statusSchema = z.enum(["OPEN", "IN_TRANSIT", "DELIVERED"]);
