"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { OpenTextAnswer, OpenTextContent } from "@/types/exercise-content";

/**
 * An open comprehension question with a self-check reveal. No AI needed: the model answer and
 * explanation are stored with the exercise. The learner can jot an answer, then reveal the model answer.
 */
export function OpenQuestion({
  content,
  answer,
}: {
  content: OpenTextContent;
  answer: OpenTextAnswer | null;
}) {
  const [own, setOwn] = useState("");
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-navy-900">{content.question}</p>
      <textarea
        value={own}
        onChange={(event) => setOwn(event.target.value)}
        rows={2}
        placeholder="Typ hier je antwoord…"
        className="w-full rounded-lg border border-navy-200 bg-white px-3.5 py-2 text-sm text-navy-900 placeholder:text-navy-300 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100"
      />
      {answer ? (
        revealed ? (
          <div className="rounded-lg bg-navy-50 p-3 text-sm text-navy-700">
            <p>
              <span className="font-semibold">Antwoord: </span>
              {answer.answer}
            </p>
            {answer.explanation ? <p className="mt-1 text-navy-500">{answer.explanation}</p> : null}
          </div>
        ) : (
          <Button type="button" size="sm" variant="outline" className="w-fit" onClick={() => setRevealed(true)}>
            Toon antwoord
          </Button>
        )
      ) : null}
    </div>
  );
}
