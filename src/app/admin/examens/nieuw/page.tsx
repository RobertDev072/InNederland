import { Card, CardContent } from "@/components/ui/card";
import { ExamForm } from "../_components/exam-form";

export default function NewExamPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Nieuw proefexamen</h1>
      <Card>
        <CardContent>
          <ExamForm />
        </CardContent>
      </Card>
    </div>
  );
}
