import { Card, CardContent } from "@/components/ui/card";
import { KnmTopicForm } from "../_components/knm-topic-form";

export default function NewKnmTopicPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Nieuw KNM-hoofdstuk</h1>
      <Card>
        <CardContent>
          <KnmTopicForm />
        </CardContent>
      </Card>
    </div>
  );
}
