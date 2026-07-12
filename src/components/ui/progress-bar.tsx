import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  trackClassName,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-navy-100", trackClassName)}
    >
      <div
        className={cn("h-full rounded-full bg-orange-500 transition-all", className)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
