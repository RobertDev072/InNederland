import { notFound, redirect } from "next/navigation";
import { getCurrentProfile, hasFullAccess } from "@/lib/profile/queries";
import { getLessonWithExercises } from "@/lib/exercises/queries";
import { asContent } from "@/types/exercise-content";
import { LessonClient } from "../_components/lesson-client";

export default async function SchrijvenLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  const [profile, lessonData] = await Promise.all([
    getCurrentProfile(),
    getLessonWithExercises(lessonId),
  ]);

  if (!lessonData) {
    notFound();
  }

  const { lesson, exercises } = lessonData;
  const writingExercise = exercises.find((exercise) => exercise.type === "writing_task");

  if (!writingExercise) {
    notFound();
  }

  if (!lesson.isFree && !hasFullAccess(profile)) {
    redirect("/toegang");
  }

  const content = asContent("writing_task", writingExercise.content);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{lesson.title}</h1>
        {lesson.description ? <p className="mt-1 text-navy-500">{lesson.description}</p> : null}
      </div>

      <LessonClient
        exerciseId={writingExercise.id}
        instructions={content.instructions}
        minWords={content.minWords}
        nativeLanguage={profile?.nativeLanguage ?? null}
      />
    </div>
  );
}
