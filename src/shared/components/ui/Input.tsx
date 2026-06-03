import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, invalid, ...rest }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'flex w-full rounded-md border bg-white text-sm',
            'h-9 px-3 py-2',
            'placeholder:text-neutral-400',
            'outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            invalid
              ? 'border-red-400 focus-visible:ring-red-500'
              : 'border-neutral-300',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            className,
          )}
          {...rest}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';