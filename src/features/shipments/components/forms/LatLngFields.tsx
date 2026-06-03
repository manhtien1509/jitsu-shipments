import type {
  UseFormRegister,
  FieldErrors,
  Path,
  FieldValues,
} from 'react-hook-form';
import { FormField } from '@/shared/components/form/FormField';
import { TextInput } from '@/shared/components/form/TextInput';

interface Props<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
  latName: Path<T>;
  lngName: Path<T>;
}

export function LatLngFields<T extends FieldValues>({
  register,
  errors,
  disabled,
  latName,
  lngName,
}: Props<T>) {
  const latError = (errors[latName] as { message?: string } | undefined)?.message;
  const lngError = (errors[lngName] as { message?: string } | undefined)?.message;

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField label="Latitude" required error={latError}>
        <TextInput
          type="number"
          step="any"
          disabled={disabled}
          {...register(latName)}
        />
      </FormField>

      <FormField label="Longitude" required error={lngError}>
        <TextInput
          type="number"
          step="any"
          disabled={disabled}
          {...register(lngName)}
        />
      </FormField>
    </div>
  );
}