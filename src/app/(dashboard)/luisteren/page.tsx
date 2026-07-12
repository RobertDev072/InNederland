import { getCurrentProfile } from "@/lib/profile/queries";
import { getLessonsForSkill } from "@/lib/exercises/queries";
import { LockedLevelNotice } from "@/components/dashboard/locked-level-notice";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { AVAILABLE_LEVELS, type LevelCode } from "@/types/content";

export default async function LuisterenPage() {
  const profile = await getCurrentProfile();
  const targetLevel = (profile?.targetLevel as LevelCode | null) ?? null;
  if (!targetLevel || !AVAILABLE_LEVELS.includes(targetLevel)) {
    return <LockedLevelNotice targetLevel={targetLevel} />;
  }
  const lessons = await getLessonsForSkill(targetLevel, "luisteren");
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <h1 className="text-2xl font-bold text-navy-900">Luisteren</h1>
      {lessons.map((lesson) => (
        <Card key={lesson.id}>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">{lesson.title}</CardTitle>
              {lesson.description ? <CardDescription>{lesson.description}</CardDescription> : null}
            </div>
            <LinkButton href={`/luisteren/${lesson.id}`} size="sm" variant="outline">
              Start
            </LinkButton>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
