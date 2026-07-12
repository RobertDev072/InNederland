import { notFound } from "next/navigation";
import { getLessonForAdmin } from "@/lib/admin/content/lessons";
import { Card, CardContent } from "@/components/ui/card";
import { ExerciseForm } from "../../_components/exercise-form";

const TYPE_LABELS: Record<string, string> = {
  reading_text: "Leestekst",
  listening_clip: "Luisterfragment",
  writing_task: "Schrijfopdracht",
  speaking_prompt: "Spreekopdracht",
  multiple_choice: "Meerkeuzevraag",
  open_text: "Open vraag",
};

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ lessonId: string; exerciseId: string }>;
}) {
  const { lessonId, exerciseId } = await params;
  const data = await getLessonForAdmin(lessonId);

  if (!data) {
    notFound();
  }

  const exercise = data.exercises.find((item) => item.id === exerciseId);

  if (!exercise) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-navy-900">
        Oefening bewerken — {TYPE_LABELS[exercise.type] ?? exercise.type}
      </h1>
      <Card>
        <CardContent>
          <ExerciseForm lessonId={lessonId} type={exercise.type} exercise={exercise} />
        </CardContent>
      </Card>
    </div>
  );
}
