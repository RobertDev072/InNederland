import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "navy" | "orange" | "success" | "neutral" | "outline";

const variantClasses: Record<Variant, string> = {
  navy: "bg-navy-800 text-white",
  orange: "bg-orange-500 text-white",
  success: "bg-emerald-100 text-emerald-800",
  neutral: "bg-navy-50 text-navy-600",
  outline: "border border-navy-200 text-navy-600",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
