import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Dialog } from "@/shared/components/ui/Dialog";
import { Button } from "@/shared/components/ui/Button";
import { FormField } from "@/shared/components/form/FormField";
import { TextInput } from "@/shared/components/form/TextInput";

import { useCreateAssignment } from "@/features/assignments/api/useCreateAssignment";
import {
  assignmentCreateSchema,
  type AssignmentCreateFormInput,
  type AssignmentCreateFormValues,
} from "@/features/assignments/schemas/assignment-create.schema";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}

const DEFAULTS: AssignmentCreateFormInput = { label: "" };

export function AssignmentCreateDialog({ open, onClose, onCreated }: Props) {
  const createMutation = useCreateAssignment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignmentCreateFormInput, unknown, AssignmentCreateFormValues>({
    resolver: zodResolver(assignmentCreateSchema),
    defaultValues: DEFAULTS,
  });

  useEffect(() => {
    if (open) reset(DEFAULTS);
  }, [open, reset]);

  const onSubmit = handleSubmit((values) => {
    createMutation.mutate(
      {
        label: values.label,
        status: "OPEN",
        clients: [],
        shipment_count: 0,
      },
      {
        onSuccess: (created) => {
          toast.success(`Created assignment ${created.label}`);
          onCreated?.(created.id);
          onClose();
        },
        onError: () => toast.error("Failed to create assignment"),
      },
    );
  });

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="ghost"
        onClick={onClose}
        disabled={createMutation.isPending}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="assignment-create-form"
        loading={createMutation.isPending}
      >
        Create
      </Button>
    </div>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="New Assignment"
      footer={footer}
    >
      <form
        id="assignment-create-form"
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <FormField label="Label" required error={errors.label?.message}>
          <TextInput placeholder="TX-127" {...register("label")} />
        </FormField>
        <p className="text-xs text-neutral-500">
          New assignments start in <strong>OPEN</strong> status with no
          shipments.
        </p>
      </form>
    </Dialog>
  );
}
