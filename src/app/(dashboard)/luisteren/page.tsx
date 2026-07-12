import { getTranslations } from "next-intl/server";
import { getCurrentProfile, hasFullAccess, isLevelAvailable, resolveViewLevel } from "@/lib/profile/queries";
import { getLessonsForSkill } from "@/lib/exercises/queries";
import { LockedLevelNotice } from "@/components/dashboard/locked-level-notice";
import { LessonListItem } from "@/components/dashboard/lesson-list-item";
import { LevelSwitcher } from "@/components/dashboard/level-switcher";

export default async function LuisterenPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const t = await getTranslations("Skills");
  const { level } = await searchParams;
  const profile = await getCurrentProfile();
  const targetLevel = resolveViewLevel(profile, level);
  const isAdmin = profile?.role === "admin";

  if (!targetLevel || !isLevelAvailable(targetLevel, profile)) {
    return <LockedLevelNotice targetLevel={targetLevel} />;
  }

  const lessons = await getLessonsForSkill(targetLevel, "luisteren");
  const fullAccess = hasFullAccess(profile);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <h1 className="text-2xl font-bold text-navy-900">{t("luisterenTitle")}</h1>
      {isAdmin ? <LevelSwitcher basePath="/luisteren" activeLevel={targetLevel} /> : null}
      {lessons.length === 0 ? (
        <p className="text-navy-500">{t("noLessonsForLevel")}</p>
      ) : (
        lessons.map((lesson) => (
          <LessonListItem
            key={lesson.id}
            id={lesson.id}
            title={lesson.title}
            description={lesson.description}
            isFree={lesson.isFree}
            hasFullAccess={fullAccess}
            hrefBase="/luisteren"
          />
        ))
      )}
    </div>
  );
}
