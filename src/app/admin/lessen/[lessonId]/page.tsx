import { notFound } from "next/navigation";
import { getLessonForAdmin } from "@/lib/admin/content/lessons";
import { LEVEL_LABELS, SKILL_LABELS, type LevelCode, type SkillCode } from "@/types/content";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LessonEditForm } from "./_components/lesson-edit-form";
import { DeleteExerciseButton } from "./_components/delete-exercise-button";

const TYPE_LABELS: Record<string, string> = {
  reading_text: "Leestekst",
  listening_clip: "Luisterfragment",
  writing_task: "Schrijfopdracht",
  speaking_prompt: "Spreekopdracht",
  multiple_choice: "Meerkeuzevraag",
  open_text: "Open vraag",
};

export default async function AdminLessonDetailPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const data = await getLessonForAdmin(lessonId);

  if (!data) {
    notFound();
  }

  const { lesson, exercises } = data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{lesson.title}</h1>
        <p className="text-navy-500">
          {LEVEL_LABELS[lesson.levelCode as LevelCode] ?? lesson.levelCode} ·{" "}
          {SKILL_LABELS[lesson.skillCode as SkillCode] ?? lesson.skillCode}
        </p>
      </div>

      <Card>
        <CardContent>
          <CardTitle className="mb-3 text-base">Lesgegevens</CardTitle>
          <LessonEditForm lessonId={lesson.id} lesson={lesson} />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-900">Oefeningen</h2>
        <LinkButton href={`/admin/lessen/${lesson.id}/oefeningen/nieuw`} size="sm">
          + Oefening toevoegen
        </LinkButton>
      </div>

      {exercises.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-navy-500">Nog geen oefeningen in deze les.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {exercises.map((exercise) => (
            <Card key={exercise.id}>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <Badge variant="neutral">{TYPE_LABELS[exercise.type] ?? exercise.type}</Badge>
                  <p className="mt-1 text-sm font-medium text-navy-800">{exercise.prompt}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <LinkButton
                    href={`/admin/lessen/${lesson.id}/oefeningen/${exercise.id}`}
                    size="sm"
                    variant="outline"
                  >
                    Bewerken
                  </LinkButton>
                  <DeleteExerciseButton lessonId={lesson.id} exerciseId={exercise.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
