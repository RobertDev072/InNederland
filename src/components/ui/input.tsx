import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-lg border border-navy-200 bg-white px-3.5 text-sm text-navy-900",
          "placeholder:text-navy-300",
          "focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100",
          "disabled:cursor-not-allowed disabled:bg-navy-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("mb-1.5 block text-sm font-medium text-navy-700", className)} {...props} />
  );
}
