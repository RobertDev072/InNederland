import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MultipleChoiceQuestion } from "@/components/exercises/multiple-choice-question";
import { getCurrentProfile } from "@/lib/profile/queries";
import type { KnmTopicContent } from "@/types/exercise-content";

export default async function KnmTopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;

  const supabase = await createClient();
  const [{ data: topic }, profile] = await Promise.all([
    supabase
      .from("knm_topics")
      .select("id, category, title, content, sort_order")
      .eq("id", topicId)
      .single(),
    getCurrentProfile(),
  ]);

  if (!topic) {
    notFound();
  }

  const content = topic.content as unknown as KnmTopicContent;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Badge variant="navy" className="w-fit">
          {topic.category}
        </Badge>
        <h1 className="text-2xl font-bold text-navy-900">{topic.title}</h1>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-6">
          {content.sections.map((section, index) => (
            <div key={index} className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-navy-900">{section.heading}</h2>
              <p className="text-navy-700">{section.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {content.checkQuestions && content.checkQuestions.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-navy-900">Controlevragen</h2>
          {content.checkQuestions.map((question, index) => (
            <Card key={index}>
              <CardContent>
                <MultipleChoiceQuestion
                  content={{ question: question.question, options: question.options }}
                  correctAnswer={{ correctIndex: question.correctIndex }}
                  nativeLanguage={profile?.nativeLanguage}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
