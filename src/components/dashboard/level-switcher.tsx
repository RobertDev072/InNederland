import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { LEVEL_CODES, LEVEL_LABELS, type LevelCode } from "@/types/content";

/** Admin-only control to browse/manage any level's content, regardless of their own profile.targetLevel. */
export async function LevelSwitcher({ basePath, activeLevel }: { basePath: string; activeLevel: LevelCode }) {
  const t = await getTranslations("Skills");

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-card border border-navy-100 bg-white p-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-navy-400">
        {t("adminLevelLabel")}
      </span>
      {LEVEL_CODES.map((level) => (
        <Link
          key={level}
          href={`${basePath}?level=${level}`}
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium transition-colors",
            level === activeLevel
              ? "bg-orange-500 text-white"
              : "bg-navy-50 text-navy-600 hover:bg-navy-100",
          )}
        >
          {LEVEL_LABELS[level]}
        </Link>
      ))}
    </div>
  );
}
