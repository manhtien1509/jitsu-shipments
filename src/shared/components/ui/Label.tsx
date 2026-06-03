import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({
  className,
  required,
  children,
  ...rest
}: LabelProps) {
  return (
    <label
      className={cn(
        'block text-sm font-medium text-neutral-700 mb-1.5',
        className,
      )}
      {...rest}
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}