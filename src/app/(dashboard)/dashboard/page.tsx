import { getTranslations } from "next-intl/server";
import { getCurrentProfile, hasFullAccess } from "@/lib/profile/queries";
import { ensureCurrentStudyPlan } from "@/lib/study-plan/queries";
import { StudyPlanCard } from "@/components/dashboard/study-plan-card";
import { AccessBanner } from "@/components/dashboard/access-banner";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { LevelPill } from "@/components/ui/level-pill";
import { YouTubeEmbed } from "@/components/exercises/youtube-embed";
import { AVAILABLE_LEVELS, LEVEL_CODES, LEVEL_LABELS, type LevelCode } from "@/types/content";

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard");
  const profile = await getCurrentProfile();
  const targetLevel = (profile?.targetLevel as LevelCode | null) ?? null;
  const studyPlan = await ensureCurrentStudyPlan(profile!.id, targetLevel);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">
          {t("welcomeBack")}
          {profile?.fullName ? `, ${profile.fullName}` : ""}
        </h1>
        <p className="text-navy-500">
          {t("goal")}: {targetLevel ? LEVEL_LABELS[targetLevel] : t("goalNotChosen")}
          {profile?.targetExamDate
            ? ` • ${t("examOn")} ${new Date(profile.targetExamDate).toLocaleDateString("nl-NL")}`
            : ""}
          {profile?.minutesPerDay ? ` • ${profile.minutesPerDay} ${t("minutesPerDay")}` : ""}
        </p>
      </div>

      {!hasFullAccess(profile) ? <AccessBanner /> : null}

      {hasFullAccess(profile) ? (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div>
              <CardTitle className="text-base">{t("examVideoTitle")}</CardTitle>
              <CardDescription>{t("examVideoSubtitle")}</CardDescription>
            </div>
            <YouTubeEmbed videoId="vjMB8b_Owy4" title="Inburgeringsexamen — alles wat je moet weten" />
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {LEVEL_CODES.map((level) => (
          <LevelPill
            key={level}
            level={level}
            active={level === targetLevel}
            locked={!AVAILABLE_LEVELS.includes(level)}
          />
        ))}
      </div>

      {studyPlan ? (
        <StudyPlanCard plan={studyPlan} />
      ) : (
        <Card>
          <CardContent>
            <p className="text-navy-600">
              {targetLevel && !AVAILABLE_LEVELS.includes(targetLevel)
                ? t("noContentForLevel", { level: LEVEL_LABELS[targetLevel] })
                : t("noStudyPlanYet")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
