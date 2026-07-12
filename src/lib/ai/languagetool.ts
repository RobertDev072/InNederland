export interface LanguageToolMatch {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: { value: string }[];
  rule: { id: string; description: string; category: { name: string } };
}

/** Free-tier grammar/spelling pass for Dutch text, used as a first layer before Gemini feedback. */
export async function checkDutchText(text: string): Promise<LanguageToolMatch[]> {
  const url = process.env.LANGUAGETOOL_API_URL || "https://api.languagetool.org/v2/check";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ text, language: "nl" }),
  });

  if (!res.ok) {
    throw new Error(`LanguageTool-aanvraag mislukt (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { matches?: LanguageToolMatch[] };
  return data.matches ?? [];
}
