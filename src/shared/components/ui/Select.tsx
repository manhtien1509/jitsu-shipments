import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, invalid, ...rest }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            'flex w-full appearance-none rounded-md border bg-white text-sm',
            'h-9 pl-3 pr-9 py-2',
            'outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            invalid
              ? 'border-red-400 focus-visible:ring-red-500'
              : 'border-neutral-300',
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
      </div>
    );
  },
);

Select.displayName = 'Select';