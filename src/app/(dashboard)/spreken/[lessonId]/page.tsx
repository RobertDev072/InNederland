import { notFound, redirect } from "next/navigation";
import { getLessonWithExercises } from "@/lib/exercises/queries";
import { getCurrentProfile, hasFullAccess } from "@/lib/profile/queries";
import { asContent, asLessonContent } from "@/types/exercise-content";
import { LessonSections } from "@/components/exercises/lesson-sections";
import { SprekenLessonClient } from "../_components/lesson-client";

export default async function SprekenLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  const [data, profile] = await Promise.all([getLessonWithExercises(lessonId), getCurrentProfile()]);

  if (!data) {
    notFound();
  }

  const { lesson, exercises } = data;
  const primary = exercises.find((exercise) => exercise.type === "speaking_prompt");

  if (!primary) {
    notFound();
  }

  if (!lesson.isFree && !hasFullAccess(profile)) {
    redirect("/toegang");
  }

  const content = asContent("speaking_prompt", primary.content);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{lesson.title}</h1>
        {lesson.description ? <p className="mt-1 text-navy-500">{lesson.description}</p> : null}
      </div>
      <LessonSections
        content={asLessonContent(lesson.content)}
        nativeLanguage={profile?.nativeLanguage ?? null}
      />
      <SprekenLessonClient
        exerciseId={primary.id}
        scenario={content.scenario}
        expectedPoints={content.expectedPoints}
        youtubeVideoId={content.youtubeVideoId}
        imageUrl={content.imageUrl}
        modelAnswer={content.modelAnswer}
      />
    </div>
  );
}
