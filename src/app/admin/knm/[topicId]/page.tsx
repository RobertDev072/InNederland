import { notFound } from "next/navigation";
import { getKnmTopic } from "@/lib/admin/content/knm";
import { Card, CardContent } from "@/components/ui/card";
import { KnmTopicForm } from "../_components/knm-topic-form";
import { DeleteKnmButton } from "./_components/delete-knm-button";

export default async function EditKnmTopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = await getKnmTopic(topicId);

  if (!topic) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">{topic.title}</h1>
        <DeleteKnmButton topicId={topic.id} />
      </div>
      <Card>
        <CardContent>
          <KnmTopicForm topic={topic} />
        </CardContent>
      </Card>
    </div>
  );
}
