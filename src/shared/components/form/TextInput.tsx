import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";
import { inputBaseClasses } from "./inputBaseClasses";

export const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, spellCheck = false, ...props }, ref) => (
  <input
    ref={ref}
    spellCheck={spellCheck}
    className={cn(inputBaseClasses, className)}
    {...props}
  />
));
TextInput.displayName = "TextInput";
