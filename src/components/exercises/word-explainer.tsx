"use client";

import { useState } from "react";

/** A single Dutch vocabulary word that fetches an AI explanation (in the learner's language) on click. */
export function WordExplainer({
  word,
  nativeLanguage,
}: {
  word: string;
  nativeLanguage?: string | null;
}) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function explain() {
    if (loading) return;
    if (explanation) {
      setExplanation(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/explain-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, nativeLanguage: nativeLanguage ?? undefined }),
      });
      const data = (await res.json()) as { explanation?: string };
      setExplanation(data.explanation ?? "Geen uitleg gevonden.");
    } catch {
      setExplanation("Uitleg kon niet worden opgehaald.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={explain}
        className="w-fit text-left font-semibold text-navy-800 underline decoration-dotted underline-offset-2 hover:text-orange-700"
      >
        {word}
      </button>
      {loading ? (
        <span className="text-xs text-navy-400">Uitleg wordt opgehaald…</span>
      ) : explanation ? (
        <span className="rounded-lg bg-orange-50 px-2 py-1 text-sm text-orange-900">{explanation}</span>
      ) : null}
    </>
  );
}
