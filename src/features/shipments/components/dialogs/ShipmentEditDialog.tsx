import { Controller } from "react-hook-form";
import { toast } from "sonner";

import { useEditShipment } from "@/features/shipments/api/useEditShipment";
import {
  getStatusDropdownOptions,
  requiresAssignment,
} from "@/features/shipments/lib/status-transitions";
import { useAssignments } from "@/features/assignments/api/useAssignments";
import type {
  Shipment,
  ShipmentUpdate,
} from "@/features/shipments/types/shipment.types";
import type { ShipmentEditFormValues } from "@/features/shipments/schemas/shipment-edit.schema";
import { Dialog } from "@/shared/components/ui/Dialog";
import { Button } from "@/shared/components/ui/Button";
import { FormField } from "@/shared/components/form/FormField";
import { TextInput } from "@/shared/components/form/TextInput";
import { Select } from "@/shared/components/ui";
import { LatLngFields } from "../forms/LatLngFields";
import { useShipmentEditForm } from "./hooks/useShipmentEditForm";

interface Props {
  open: boolean;
  shipment: Shipment | null;
  onClose: () => void;
}

export function ShipmentEditDialog({ open, shipment, onClose }: Props) {
  const editShipmentMutation = useEditShipment();
  const { data: assignments = [] } = useAssignments();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useShipmentEditForm(shipment, open);

  const status = watch("status");

  const validStatuses = shipment
    ? getStatusDropdownOptions(shipment.status)
    : [];
  const showAssignment = requiresAssignment(status);
  const openAssignments = assignments.filter((a) => a.status === "OPEN");

  const onSubmit = handleSubmit(async (values: ShipmentEditFormValues) => {
    if (!shipment) return;

    // Business rule: OPEN status → no assignment
    const nextAssignmentId =
      values.status === "OPEN" ? null : (values.assignment_id ?? null);

    const next: ShipmentUpdate = {
      delivery_by_date: new Date(values.delivery_by_date).toISOString(),
      lat: values.lat,
      lng: values.lng,
      status: values.status,
      assignment_id: nextAssignmentId,
    };

    editShipmentMutation.mutate(
      { prev: shipment, next },
      {
        onSuccess: () => {
          toast.success("Shipment updated");
          onClose();
        },
        onError: (err) =>
          toast.error(
            err instanceof Error ? err.message : "Failed to update shipment",
          ),
      },
    );
  });

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        onClick={onClose}
        disabled={editShipmentMutation.isPending}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="shipment-edit-form"
        loading={editShipmentMutation.isPending}
        disabled={!isDirty}
      >
        Save changes
      </Button>
    </div>
  );

  return (
    <Dialog
      open={open && !!shipment}
      onClose={onClose}
      title={shipment ? `Edit ${shipment.label}` : ""}
      footer={footer}
    >
      <form id="shipment-edit-form" onSubmit={onSubmit} className="space-y-4">
        <FormField label="Status" error={errors.status?.message}>
          <Select
            {...register("status")}
            disabled={editShipmentMutation.isPending}
          >
            {validStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FormField>

        {showAssignment && (
          <FormField
            label="Assignment"
            error={errors.assignment_id?.message}
            required
          >
            <Controller
              control={control}
              name="assignment_id"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  disabled={editShipmentMutation.isPending}
                >
                  <option value="">-- Select assignment --</option>
                  {openAssignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </Select>
              )}
            />
          </FormField>
        )}

        <FormField
          label="Delivery by"
          error={errors.delivery_by_date?.message}
          required
        >
          <TextInput
            type="datetime-local"
            {...register("delivery_by_date")}
            disabled={editShipmentMutation.isPending}
          />
        </FormField>

        <LatLngFields
          register={register}
          errors={errors}
          disabled={editShipmentMutation.isPending}
          latName="lat"
          lngName="lng"
        />
      </form>
    </Dialog>
  );
}
