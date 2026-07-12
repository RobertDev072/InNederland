"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useSpeechRecognition } from "@/lib/speech/useSpeechRecognition";
import { recordExerciseAttempt } from "@/lib/exercises/actions";
import type { SpeakingFeedback } from "@/types/feedback";
import type { Json } from "@/types/database";
import { cn } from "@/lib/utils";

export function SprekenLessonClient({
  exerciseId,
  scenario,
  expectedPoints,
}: {
  exerciseId: string;
  scenario: string;
  expectedPoints?: string[];
}) {
  const { transcript, isListening, isSupported, start, stop, reset } = useSpeechRecognition("nl-NL");
  const [manualText, setManualText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentTranscript = isSupported ? transcript : manualText;
  const canSubmit = currentTranscript.trim().length > 0 && !isSubmitting;

  function handleToggleRecording() {
    if (isListening) {
      stop();
    } else {
      setFeedback(null);
      setError(null);
      start();
    }
  }

  function handleOpnieuw() {
    reset();
    setManualText("");
    setFeedback(null);
    setError(null);
  }

  async function handleSubmit() {
    if (!currentTranscript.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/feedback-speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          expectedPoints,
          transcript: currentTranscript,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "De beoordeling is mislukt. Probeer het opnieuw.");
      }

      const data = (await res.json()) as SpeakingFeedback;
      setFeedback(data);

      await recordExerciseAttempt({
        exerciseId,
        response: { transcript: currentTranscript },
        aiFeedback: data as unknown as Json,
        score: data.score,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "De beoordeling is mislukt. Probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-3">
          <CardTitle className="text-base">Situatie</CardTitle>
          <p className="text-navy-700">{scenario}</p>
          <p className="text-sm text-navy-500">
            We beoordelen de tekst die door spraakherkenning wordt herkend, niet je uitspraak zelf.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          {isSupported ? (
            <>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant={isListening ? "danger" : "primary"}
                  onClick={handleToggleRecording}
                >
                  {isListening ? "Stop opname" : "Start opname"}
                </Button>
                {isListening ? (
                  <span className="text-sm text-navy-500">Luisteren…</span>
                ) : null}
              </div>
              <div className="min-h-16 rounded-lg border border-navy-100 bg-navy-50 p-3 text-sm text-navy-700">
                {transcript || "Je gesproken tekst verschijnt hier zodra je begint met opnemen."}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-navy-500">
                Spraakherkenning wordt niet ondersteund in deze browser. Typ hieronder wat je zou zeggen.
              </p>
              <textarea
                value={manualText}
                onChange={(event) => setManualText(event.target.value)}
                rows={4}
                className="rounded-lg border border-navy-200 p-3 text-sm text-navy-900 focus:border-navy-400 focus:outline-none"
                placeholder="Typ hier je antwoord…"
              />
            </div>
          )}

          {error ? <p className="text-sm text-flag-red">{error}</p> : null}

          <div className="flex items-center gap-3">
            <Button type="button" onClick={handleSubmit} disabled={!canSubmit} loading={isSubmitting}>
              Verstuur
            </Button>
            {feedback ? (
              <Button type="button" variant="outline" onClick={handleOpnieuw}>
                Opnieuw proberen
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {feedback ? (
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Feedback</CardTitle>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-semibold",
                  feedback.score >= 70
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-orange-50 text-orange-700",
                )}
              >
                {feedback.score}/100
              </span>
            </div>

            {feedback.strengths.length > 0 ? (
              <div>
                <CardDescription className="mb-1 font-medium text-navy-700">Sterke punten</CardDescription>
                <ul className="list-disc pl-5 text-sm text-navy-700">
                  {feedback.strengths.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {feedback.improvements.length > 0 ? (
              <div>
                <CardDescription className="mb-1 font-medium text-navy-700">Verbeterpunten</CardDescription>
                <ul className="list-disc pl-5 text-sm text-navy-700">
                  {feedback.improvements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {feedback.missedPoints.length > 0 ? (
              <div>
                <CardDescription className="mb-1 font-medium text-navy-700">Gemiste punten</CardDescription>
                <ul className="list-disc pl-5 text-sm text-navy-700">
                  {feedback.missedPoints.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
