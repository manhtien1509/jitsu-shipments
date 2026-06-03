import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useCreateShipment } from "../../hooks/useCreateShipment";
import {
  shipmentCreateSchema,
  type ShipmentCreateFormInput,
  type ShipmentCreateFormValues,
} from "../../schemas/shipment-create.schema";
import { buildShipmentCreatePayload } from "../../lib/shipment-create.mapper";
import { Dialog } from "@/shared/components/ui/Dialog";
import { Button } from "@/shared/components/ui/Button";
import { FormField } from "@/shared/components/form/FormField";
import { TextInput } from "@/shared/components/form/TextInput";
import { LatLngFields } from "../forms/LatLngFields";
import { useShipmentsStore } from "../..";

interface Props {
  open: boolean;
  onClose: () => void;
}

const DEFAULT_VALUES: ShipmentCreateFormInput = {
  client_name: "",
  label: "",
  delivery_by_date: "",
  lat: 0,
  lng: 0,
};

export function ShipmentCreateDialog({ open, onClose }: Props) {
  const createShipmentMutation = useCreateShipment();
  const setSelectedId = useShipmentsStore((s) => s.setSelectedId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShipmentCreateFormInput, unknown, ShipmentCreateFormValues>({
    resolver: zodResolver(shipmentCreateSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) reset(DEFAULT_VALUES);
  }, [open, reset]);

  const onSubmit = handleSubmit((values) => {
    const payload = buildShipmentCreatePayload(values);

    createShipmentMutation.mutate(payload, {
      onSuccess: (shipment) => {
        setSelectedId(shipment.id);
        toast.success(`Created shipment ${shipment.label}`);
        onClose();
      },

      onError: () => {
        toast.error("Failed to create shipment");
      },
    });
  });

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="ghost"
        onClick={onClose}
        disabled={createShipmentMutation.isPending}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="shipment-create-form"
        loading={createShipmentMutation.isPending}
      >
        Create
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onClose={onClose} title="New Shipment" footer={footer}>
      <form id="shipment-create-form" onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Client Name"
          required
          error={errors.client_name?.message}
        >
          <TextInput placeholder="Acme Corp" {...register("client_name")} />
        </FormField>

        <FormField label="Label" required error={errors.label?.message}>
          <TextInput placeholder="SHP-001" {...register("label")} />
        </FormField>

        <FormField
          label="Delivery By Date"
          required
          error={errors.delivery_by_date?.message}
        >
          <TextInput type="date" {...register("delivery_by_date")} />
        </FormField>

        <LatLngFields
          register={register}
          errors={errors}
          disabled={createShipmentMutation.isPending}
          latName="lat"
          lngName="lng"
        />
      </form>
    </Dialog>
  );
}
