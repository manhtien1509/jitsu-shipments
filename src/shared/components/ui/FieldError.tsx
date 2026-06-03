import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export function FieldError({ message, className, ...rest }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className={cn('mt-1.5 text-xs text-red-600', className)}
      {...rest}
    >
      {message}
    </p>
  );
}