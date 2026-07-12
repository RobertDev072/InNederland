"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClickableText } from "@/components/exercises/clickable-text";
import { MultipleChoiceQuestion } from "@/components/exercises/multiple-choice-question";
import { recordExerciseAttempt } from "@/lib/exercises/actions";
import { useSpeechSynthesis } from "@/lib/speech/useSpeechSynthesis";
import { asAnswer, asContent } from "@/types/exercise-content";
import type { ExerciseView } from "@/lib/exercises/queries";

export function LessonClient({
  clipExercise,
  questionExercises,
  nativeLanguage,
}: {
  clipExercise: ExerciseView;
  questionExercises: ExerciseView[];
  nativeLanguage: string | null;
}) {
  const { speak, isSpeaking, isSupported } = useSpeechSynthesis();
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const clipContent = asContent("listening_clip", clipExercise.content);

  function handlePlay() {
    speak(clipContent.script);
    setHasPlayed(true);
  }

  function handleAnswered(exerciseId: string, correct: boolean, chosenIndex: number) {
    recordExerciseAttempt({
      exerciseId,
      response: { chosenIndex },
      score: correct ? 100 : 0,
    }).catch(() => {
      // Best-effort: attempt logging shouldn't block the feedback already shown in the UI.
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          {isSupported ? (
            <>
              <Button size="lg" onClick={handlePlay} disabled={isSpeaking}>
                {isSpeaking ? "Bezig met afspelen…" : "Beluister het fragment"}
              </Button>
              {hasPlayed ? (
                <button
                  type="button"
                  onClick={() => setShowTranscript((visible) => !visible)}
                  className="text-sm font-medium text-navy-500 underline hover:text-navy-700"
                >
                  {showTranscript ? "Verberg transcript" : "Toon transcript"}
                </button>
              ) : null}
              {showTranscript ? (
                <div className="mt-2 w-full max-w-xl text-left">
                  <ClickableText text={clipContent.script} nativeLanguage={nativeLanguage} />
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex w-full flex-col gap-4 text-left">
              <p className="text-center text-navy-600">
                Je browser ondersteunt geen gesproken audio. Lees het fragment hieronder.
              </p>
              <ClickableText text={clipContent.script} nativeLanguage={nativeLanguage} />
            </div>
          )}
        </CardContent>
      </Card>

      {questionExercises.length > 0 ? (
        <div className="flex flex-col gap-4">
          {questionExercises.map((exercise) => {
            const content = asContent("multiple_choice", exercise.content);
            const answer = asAnswer("multiple_choice", exercise.correctAnswer);
            if (!answer) return null;
            return (
              <Card key={exercise.id}>
                <CardContent>
                  <MultipleChoiceQuestion
                    content={content}
                    correctAnswer={answer}
                    nativeLanguage={nativeLanguage}
                    onAnswered={(correct, chosenIndex) =>
                      handleAnswered(exercise.id, correct, chosenIndex)
                    }
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
