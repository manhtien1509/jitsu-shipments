import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex w-full rounded-md border bg-white text-sm',
          'min-h-20 px-3 py-2 resize-y',
          'placeholder:text-neutral-400',
          'outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          invalid
            ? 'border-red-400 focus-visible:ring-red-500'
            : 'border-neutral-300',
          className,
        )}
        {...rest}
      />
    );
  },
);

Textarea.displayName = 'Textarea';