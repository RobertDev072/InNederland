import { notFound } from "next/navigation";
import { getMockExamForAdmin } from "@/lib/admin/content/exams";
import { Card, CardContent } from "@/components/ui/card";
import { ExamForm } from "../_components/exam-form";
import { DeleteExamButton } from "./_components/delete-exam-button";

export default async function EditExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const exam = await getMockExamForAdmin(examId);

  if (!exam) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">{exam.title}</h1>
        <DeleteExamButton examId={exam.id} />
      </div>
      <Card>
        <CardContent>
          <ExamForm exam={exam} />
        </CardContent>
      </Card>
    </div>
  );
}
