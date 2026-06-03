import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toDateInputValue } from "@/shared/lib/date";
import type { Shipment } from "@/features/shipments/types/shipment.types";
import {
  shipmentEditSchema,
  type ShipmentEditFormInput,
  type ShipmentEditFormValues,
} from "@/features/shipments/schemas/shipment-edit.schema";

export function useShipmentEditForm(shipment: Shipment | null, open: boolean) {
  const form = useForm<ShipmentEditFormInput, unknown, ShipmentEditFormValues>({
    resolver: zodResolver(shipmentEditSchema),
    defaultValues: {
      arrival_date: "",
      delivery_by_date: "",
      lat: 0,
      lng: 0,
      status: "OPEN",
      assignment_id: null,
    },
  });

  const { reset, control, setValue } = form;

  // Reset when shipment changes
  useEffect(() => {
    if (!shipment || !open) return;
    reset({
      arrival_date: shipment.arrival_date,
      delivery_by_date: toDateInputValue(shipment.delivery_by_date),
      lat: shipment.lat,
      lng: shipment.lng,
      status: shipment.status,
      assignment_id: shipment.assignment_id ?? null,
    });
  }, [shipment, open, reset]);

  const status = useWatch({
    control,
    name: "status",
  });

  useEffect(() => {
    if (status === "OPEN") {
      setValue("assignment_id", null, { shouldValidate: true });
    }
  }, [status, setValue]);

  return form;
}
