"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { ClickableText } from "@/components/exercises/clickable-text";
import { MultipleChoiceQuestion } from "@/components/exercises/multiple-choice-question";
import { OpenQuestion } from "@/components/exercises/open-question";
import { recordExerciseAttempt } from "@/lib/exercises/actions";
import { asAnswer, asContent } from "@/types/exercise-content";
import type { ExerciseView } from "@/lib/exercises/queries";

export function LessonClient({
  readingExercise,
  questions,
  nativeLanguage,
}: {
  readingExercise: ExerciseView;
  questions: ExerciseView[];
  nativeLanguage: string | null;
}) {
  const t = useTranslations("Skills");
  const readingContent = asContent("reading_text", readingExercise.content);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-4">
          {readingContent.imageUrl ? (
            <Image
              src={readingContent.imageUrl}
              alt=""
              width={800}
              height={450}
              className="w-full rounded-lg object-cover"
              unoptimized
            />
          ) : null}
          <ClickableText text={readingContent.text} nativeLanguage={nativeLanguage} />
        </CardContent>
      </Card>

      {questions.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-navy-900">{t("comprehensionQuestions")}</h2>
          {questions.map((question) => {
            if (question.type === "open_text") {
              return (
                <Card key={question.id}>
                  <CardContent>
                    <OpenQuestion
                      content={asContent("open_text", question.content)}
                      answer={asAnswer("open_text", question.correctAnswer)}
                    />
                  </CardContent>
                </Card>
              );
            }
            const content = asContent("multiple_choice", question.content);
            const correctAnswer = asAnswer("multiple_choice", question.correctAnswer);
            if (!correctAnswer) return null;
            return (
              <Card key={question.id}>
                <CardContent>
                  <MultipleChoiceQuestion
                    content={content}
                    correctAnswer={correctAnswer}
                    nativeLanguage={nativeLanguage}
                    onAnswered={(correct) => {
                      void recordExerciseAttempt({
                        exerciseId: question.id,
                        response: { correct },
                        score: correct ? 100 : 0,
                      });
                    }}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
