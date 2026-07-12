import { cn } from "@/lib/utils";
import type { LevelCode } from "@/types/content";

export function LevelPill({
  level,
  locked,
  active,
  className,
}: {
  level: LevelCode;
  locked?: boolean;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-8 w-12 items-center justify-center rounded-full text-sm font-bold",
        active
          ? "bg-orange-500 text-white"
          : locked
            ? "bg-navy-50 text-navy-300"
            : "bg-navy-100 text-navy-700",
        className,
      )}
    >
      {level}
    </span>
  );
}
