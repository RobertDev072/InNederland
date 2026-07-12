import { getTranslations } from "next-intl/server";
import { getCurrentProfile, hasFullAccess, isLevelAvailable, resolveViewLevel } from "@/lib/profile/queries";
import { getMockExamForLevel } from "@/lib/mock-exam/queries";
import { LockedLevelNotice } from "@/components/dashboard/locked-level-notice";
import { UpgradeNotice } from "@/components/dashboard/upgrade-notice";
import { LevelSwitcher } from "@/components/dashboard/level-switcher";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { LEVEL_LABELS, SKILL_LABELS } from "@/types/content";

export default async function ProefexamenPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const { level } = await searchParams;
  const t = await getTranslations("Proefexamen");
  const tUpgrade = await getTranslations("Upgrade");
  const profile = await getCurrentProfile();
  const targetLevel = resolveViewLevel(profile, level);
  const isAdmin = profile?.role === "admin";

  if (!targetLevel || !isLevelAvailable(targetLevel, profile)) {
    return <LockedLevelNotice targetLevel={targetLevel} />;
  }
  if (!hasFullAccess(profile)) {
    return <UpgradeNotice message={tUpgrade("examMessage")} />;
  }

  const exam = await getMockExamForLevel(targetLevel);

  if (!exam) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <h1 className="text-2xl font-bold text-navy-900">{t("title")}</h1>
        {isAdmin ? <LevelSwitcher basePath="/proefexamen" activeLevel={targetLevel} /> : null}
        <Card>
          <CardContent>
            <CardDescription>{t("noExamYet")}</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sections = exam.structure.sections ?? [];
  const description =
    sections.length > 0
      ? t("sectionsFor", {
          skills: sections.map((section) => SKILL_LABELS[section.skill]).join(", "),
        })
      : t("testYourKnowledge", { level: LEVEL_LABELS[targetLevel] });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <h1 className="text-2xl font-bold text-navy-900">{t("title")}</h1>
      {isAdmin ? <LevelSwitcher basePath="/proefexamen" activeLevel={targetLevel} /> : null}
      <Card>
        <CardContent className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">{exam.title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <LinkButton href={`/proefexamen/${exam.id}`} size="sm" variant="outline">
            Start
          </LinkButton>
        </CardContent>
      </Card>
    </div>
  );
}
