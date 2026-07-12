import { getCurrentProfile } from "@/lib/profile/queries";
import { getMockExamForLevel } from "@/lib/mock-exam/queries";
import { LockedLevelNotice } from "@/components/dashboard/locked-level-notice";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { AVAILABLE_LEVELS, LEVEL_LABELS, SKILL_LABELS, type LevelCode } from "@/types/content";

export default async function ProefexamenPage() {
  const profile = await getCurrentProfile();
  const targetLevel = (profile?.targetLevel as LevelCode | null) ?? null;
  if (!targetLevel || !AVAILABLE_LEVELS.includes(targetLevel)) {
    return <LockedLevelNotice targetLevel={targetLevel} />;
  }

  const exam = await getMockExamForLevel(targetLevel);

  if (!exam) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <h1 className="text-2xl font-bold text-navy-900">Proefexamen</h1>
        <Card>
          <CardContent>
            <CardDescription>Nog geen proefexamen beschikbaar.</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sections = exam.structure.sections ?? [];
  const description =
    sections.length > 0
      ? `Dit proefexamen bevat onderdelen voor: ${sections.map((section) => SKILL_LABELS[section.skill]).join(", ")}.`
      : `Test je kennis voor ${LEVEL_LABELS[targetLevel]}.`;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <h1 className="text-2xl font-bold text-navy-900">Proefexamen</h1>
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
