"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { MultipleChoiceAnswer, MultipleChoiceContent } from "@/types/exercise-content";

export function MultipleChoiceQuestion({
  content,
  correctAnswer,
  nativeLanguage,
  onAnswered,
}: {
  content: MultipleChoiceContent;
  correctAnswer: MultipleChoiceAnswer;
  nativeLanguage?: string | null;
  onAnswered?: (correct: boolean, chosenIndex: number) => void;
}) {
  const t = useTranslations("Lezen");
  const [chosen, setChosen] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const isAnswered = chosen !== null;
  const isCorrect = chosen === correctAnswer.correctIndex;

  async function handleChoose(index: number) {
    if (isAnswered) return;
    setChosen(index);
    onAnswered?.(index === correctAnswer.correctIndex, index);

    if (index !== correctAnswer.correctIndex) {
      // Prefer the explanation stored with the exercise — no AI/API call needed.
      if (correctAnswer.explanation) {
        setExplanation(correctAnswer.explanation);
        return;
      }
      // Only when no stored explanation exists, try the AI helper (optional; may be unavailable).
      setLoadingExplanation(true);
      try {
        const res = await fetch("/api/ai/explain-answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: content.question,
            options: content.options,
            correctIndex: correctAnswer.correctIndex,
            chosenIndex: index,
            nativeLanguage: nativeLanguage ?? undefined,
          }),
        });
        const data = (await res.json()) as { explanation?: string };
        setExplanation(data.explanation ?? t("incorrectFallback"));
      } catch {
        setExplanation(t("incorrectFallback"));
      } finally {
        setLoadingExplanation(false);
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-navy-900">{content.question}</p>
      <div className="flex flex-col gap-2">
        {content.options.map((option, index) => {
          const selected = chosen === index;
          const showCorrect = isAnswered && index === correctAnswer.correctIndex;
          const showWrong = isAnswered && selected && !showCorrect;
          return (
            <button
              key={index}
              type="button"
              disabled={isAnswered}
              onClick={() => handleChoose(index)}
              className={cn(
                "rounded-lg border px-4 py-2.5 text-left text-sm transition-colors",
                showCorrect && "border-emerald-500 bg-emerald-50 text-emerald-800",
                showWrong && "border-flag-red bg-red-50 text-flag-red",
                !isAnswered && "border-navy-200 hover:border-navy-400 hover:bg-navy-50",
                isAnswered && !showCorrect && !showWrong && "border-navy-100 text-navy-400",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {isAnswered ? (
        <div
          className={cn(
            "rounded-lg p-3 text-sm",
            isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-navy-50 text-navy-700",
          )}
        >
          {isCorrect
            ? t("correct")
            : loadingExplanation
              ? t("explanationLoading")
              : (explanation ?? correctAnswer.explanation ?? t("incorrectFallback"))}
        </div>
      ) : null}
    </div>
  );
}
