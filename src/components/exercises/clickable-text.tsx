"use client";

import { useState } from "react";

interface ActiveWord {
  word: string;
  explanation: string;
  loading: boolean;
}

/** Renders a passage where every word is clickable and triggers a simple AI explanation. */
export function ClickableText({
  text,
  nativeLanguage,
}: {
  text: string;
  nativeLanguage?: string | null;
}) {
  const [active, setActive] = useState<ActiveWord | null>(null);

  async function explain(rawWord: string, sentence: string) {
    const clean = rawWord.replace(/[^\p{L}\p{N}'-]/gu, "");
    if (!clean) return;
    setActive({ word: clean, explanation: "", loading: true });
    try {
      const res = await fetch("/api/ai/explain-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: clean, sentence, nativeLanguage: nativeLanguage ?? undefined }),
      });
      const data = (await res.json()) as { explanation?: string };
      setActive({ word: clean, explanation: data.explanation ?? "Geen uitleg gevonden.", loading: false });
    } catch {
      setActive({ word: clean, explanation: "Uitleg kon niet worden opgehaald.", loading: false });
    }
  }

  const sentences = text.split(/(?<=[.!?])\s+/);

  return (
    <div className="flex flex-col gap-3">
      <p className="leading-relaxed text-navy-800">
        {sentences.map((sentence, sentenceIndex) => (
          <span key={sentenceIndex}>
            {sentence.split(/(\s+)/).map((token, tokenIndex) =>
              token.trim() ? (
                <button
                  key={tokenIndex}
                  type="button"
                  onClick={() => explain(token, sentence)}
                  className="rounded px-0.5 hover:bg-orange-100 hover:text-orange-800"
                >
                  {token}
                </button>
              ) : (
                <span key={tokenIndex}>{token}</span>
              ),
            )}{" "}
          </span>
        ))}
      </p>
      {active ? (
        <div className="rounded-lg bg-navy-50 p-3 text-sm text-navy-700">
          <span className="font-semibold">{active.word}: </span>
          {active.loading ? "Uitleg wordt opgehaald…" : active.explanation}
        </div>
      ) : null}
    </div>
  );
}
