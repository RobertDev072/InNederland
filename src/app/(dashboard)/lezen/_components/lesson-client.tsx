"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ClickableText } from "@/components/exercises/clickable-text";
import { MultipleChoiceQuestion } from "@/components/exercises/multiple-choice-question";
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
  const readingContent = asContent("reading_text", readingExercise.content);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <ClickableText text={readingContent.text} nativeLanguage={nativeLanguage} />
        </CardContent>
      </Card>

      {questions.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-navy-900">Begripsvragen</h2>
          {questions.map((question) => {
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
