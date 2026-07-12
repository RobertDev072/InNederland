import { notFound } from "next/navigation";
import { getLessonWithExercises } from "@/lib/exercises/queries";
import { getCurrentProfile } from "@/lib/profile/queries";
import { LessonClient } from "../_components/lesson-client";

export default async function LuisterenLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const [data, profile] = await Promise.all([
    getLessonWithExercises(lessonId),
    getCurrentProfile(),
  ]);

  if (!data) {
    notFound();
  }

  const { lesson, exercises } = data;
  const clipExercise = exercises.find((exercise) => exercise.type === "listening_clip");

  if (!clipExercise) {
    notFound();
  }

  const questionExercises = exercises.filter((exercise) => exercise.type === "multiple_choice");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{lesson.title}</h1>
        {lesson.description ? <p className="mt-1 text-navy-500">{lesson.description}</p> : null}
      </div>
      <LessonClient
        clipExercise={clipExercise}
        questionExercises={questionExercises}
        nativeLanguage={profile?.nativeLanguage ?? null}
      />
    </div>
  );
}
