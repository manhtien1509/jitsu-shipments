import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';
import { inputBaseClasses } from './inputBaseClasses';

export const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(inputBaseClasses, className)} {...props} />
));
TextInput.displayName = 'TextInput';