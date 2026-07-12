import { notFound, redirect } from "next/navigation";
import { getMockExamById, getExamExercises } from "@/lib/mock-exam/queries";
import { getCurrentProfile, hasFullAccess } from "@/lib/profile/queries";
import { LockedLevelNotice } from "@/components/dashboard/locked-level-notice";
import { AVAILABLE_LEVELS, type LevelCode } from "@/types/content";
import { ExamRunner } from "../_components/exam-runner";

export default async function ProefexamenDetailPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;

  const [exam, profile] = await Promise.all([getMockExamById(examId), getCurrentProfile()]);

  if (!exam) {
    notFound();
  }

  const targetLevel = (profile?.targetLevel as LevelCode | null) ?? null;
  if (!targetLevel || !AVAILABLE_LEVELS.includes(targetLevel)) {
    return <LockedLevelNotice targetLevel={targetLevel} />;
  }

  if (!hasFullAccess(profile)) {
    redirect("/toegang");
  }

  const exercises = await getExamExercises(targetLevel, exam.structure);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-navy-900">{exam.title}</h1>
      <ExamRunner
        mockExamId={exam.id}
        exercises={exercises}
        nativeLanguage={profile?.nativeLanguage ?? null}
      />
    </div>
  );
}
