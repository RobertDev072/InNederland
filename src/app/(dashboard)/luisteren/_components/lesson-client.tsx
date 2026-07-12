"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClickableText } from "@/components/exercises/clickable-text";
import { YouTubeEmbed } from "@/components/exercises/youtube-embed";
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
  const t = useTranslations("Luisteren");
  const { speak, isSpeaking, isSupported } = useSpeechSynthesis();
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const clipContent = asContent("listening_clip", clipExercise.content);

  function handlePlay() {
    if (clipContent.script) {
      speak(clipContent.script);
      setHasPlayed(true);
    }
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
          {clipContent.youtubeVideoId ? (
            <YouTubeEmbed videoId={clipContent.youtubeVideoId} title="Luisterfragment" />
          ) : isSupported ? (
            <>
              <Button size="lg" onClick={handlePlay} disabled={isSpeaking}>
                {isSpeaking ? t("playing") : t("listenButton")}
              </Button>
              {hasPlayed ? (
                <button
                  type="button"
                  onClick={() => setShowTranscript((visible) => !visible)}
                  className="text-sm font-medium text-navy-500 underline hover:text-navy-700"
                >
                  {showTranscript ? t("hideTranscript") : t("showTranscript")}
                </button>
              ) : null}
              {showTranscript && clipContent.script ? (
                <div className="mt-2 w-full max-w-xl text-left">
                  <ClickableText text={clipContent.script} nativeLanguage={nativeLanguage} />
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex w-full flex-col gap-4 text-left">
              <p className="text-center text-navy-600">{t("unsupported")}</p>
              {clipContent.script ? (
                <ClickableText text={clipContent.script} nativeLanguage={nativeLanguage} />
              ) : null}
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
