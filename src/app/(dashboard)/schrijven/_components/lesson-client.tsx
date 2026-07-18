"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import { recordExerciseAttempt } from "@/lib/exercises/actions";
import type { WritingFeedback } from "@/types/feedback";
import type { Json } from "@/types/database";

function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
}

export function LessonClient({
  exerciseId,
  instructions,
  minWords,
  modelAnswer,
  nativeLanguage,
}: {
  exerciseId: string;
  instructions: string;
  minWords?: number;
  modelAnswer?: string;
  nativeLanguage?: string | null;
}) {
  const t = useTranslations("Schrijven");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [saved, setSaved] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const wordCount = useMemo(() => countWords(text), [text]);
  const belowMinimum = typeof minWords === "number" && wordCount < minWords;

  async function handleSubmit() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/ai/feedback-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions, text, nativeLanguage: nativeLanguage ?? undefined }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Feedback ophalen is mislukt.");
      }
      const data = (await res.json()) as WritingFeedback;
      setFeedback(data);

      try {
        await recordExerciseAttempt({
          exerciseId,
          response: { text },
          aiFeedback: data as unknown as Json,
          score: data.score,
        });
        setSaved(true);
      } catch {
        // Feedback is still shown even if saving the attempt fails (e.g. not logged in).
        setSaved(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Opdracht</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="whitespace-pre-line text-navy-700">{instructions}</p>
          {typeof minWords === "number" ? (
            <Badge variant="outline" className="w-fit">
              {t("wordsMinimum", { count: minWords })}
            </Badge>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={10}
            placeholder="Schrijf hier je tekst..."
            className={cn(
              "w-full rounded-lg border border-navy-200 bg-white px-3.5 py-3 text-sm text-navy-900",
              "placeholder:text-navy-300",
              "focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100",
              "disabled:cursor-not-allowed disabled:bg-navy-50",
            )}
            disabled={loading}
          />
          <div className="flex items-center justify-between gap-4">
            <span className={cn("text-sm", belowMinimum ? "text-flag-red" : "text-navy-500")}>
              {wordCount} {wordCount === 1 ? "woord" : "woorden"}
              {typeof minWords === "number" ? ` (minimaal ${minWords})` : ""}
            </span>
            <Button onClick={handleSubmit} loading={loading} disabled={!text.trim() || loading}>
              {loading ? t("checking") : t("checkButton")}
            </Button>
          </div>
          {error ? <p className="text-sm text-flag-red">{error}</p> : null}

          {modelAnswer ? (
            showModel ? (
              <div className="rounded-lg bg-navy-50 p-3 text-sm">
                <p className="mb-1 font-medium text-navy-700">Voorbeeldantwoord</p>
                <p className="whitespace-pre-line text-navy-700">{modelAnswer}</p>
              </div>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-fit"
                onClick={() => setShowModel(true)}
              >
                Bekijk voorbeeldantwoord
              </Button>
            )
          ) : null}
        </CardContent>
      </Card>

      {feedback ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="text-base">{t("score")}</CardTitle>
            <Badge variant={feedback.score >= 70 ? "success" : "orange"}>{feedback.score}/100</Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ProgressBar value={feedback.score} />

            {feedback.strengths.length > 0 ? (
              <div>
                <CardDescription className="mb-1 font-medium text-navy-700">
                  {t("strengths")}
                </CardDescription>
                <ul className="list-inside list-disc text-sm text-navy-700">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {feedback.improvements.length > 0 ? (
              <div>
                <CardDescription className="mb-1 font-medium text-navy-700">
                  {t("improvements")}
                </CardDescription>
                <ul className="list-inside list-disc text-sm text-navy-700">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {feedback.correctedText ? (
              <div>
                <CardDescription className="mb-1 font-medium text-navy-700">
                  {t("correctedText")}
                </CardDescription>
                <div className="whitespace-pre-line rounded-lg bg-navy-50 p-3 text-sm text-navy-800">
                  {feedback.correctedText}
                </div>
              </div>
            ) : null}

            {saved ? <p className="text-xs text-navy-400">Je poging is opgeslagen.</p> : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
