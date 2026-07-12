import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { LEVEL_LABELS, type LevelCode } from "@/types/content";

/** Shown on a skill's listing page when the user's target level has no content yet. */
export async function LockedLevelNotice({ targetLevel }: { targetLevel: LevelCode | null }) {
  const t = await getTranslations("LockedLevel");

  return (
    <Card>
      <CardContent>
        <p className="text-navy-600">
          {targetLevel
            ? t("notAvailableYet", { level: LEVEL_LABELS[targetLevel] })
            : t("chooseLevelFirst")}
        </p>
      </CardContent>
    </Card>
  );
}
