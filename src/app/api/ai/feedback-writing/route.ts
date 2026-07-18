import { NextResponse } from "next/server";
import { generateJson, isAiConfigured } from "@/lib/ai/llm";
import { checkDutchText, type LanguageToolMatch } from "@/lib/ai/languagetool";
import type { WritingFeedback } from "@/types/feedback";

interface FeedbackWritingBody {
  instructions: string;
  text: string;
}

function summarizeMatches(matches: LanguageToolMatch[]): string {
  if (matches.length === 0) return "Geen fouten gevonden door de taalcontrole.";
  return matches
    .slice(0, 15)
    .map((match) => {
      const suggestion = match.replacements[0]?.value;
      return `- "${match.shortMessage || match.message}"${suggestion ? ` (suggestie: "${suggestion}")` : ""}`;
    })
    .join("\n");
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<FeedbackWritingBody>;
  const { instructions, text } = body;

  if (!instructions || !text) {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  if (!isAiConfigured()) {
    return NextResponse.json(
      {
        error:
          "Automatische AI-beoordeling is nu niet beschikbaar. Je kunt je tekst wel schrijven en zelf vergelijken met de voorbeeldzinnen in de les.",
      },
      { status: 503 },
    );
  }

  let matches: LanguageToolMatch[] = [];
  try {
    matches = await checkDutchText(text);
  } catch {
    // Continue without the grammar pass if LanguageTool is unavailable.
  }

  const prompt = `Je bent een NT2-docent Nederlands die schrijfopdrachten beoordeelt (inburgeringsniveau A2).

Opdracht: "${instructions}"

Tekst van de cursist:
"""
${text}
"""

Resultaten van een automatische taalcontrole (grammatica/spelling):
${summarizeMatches(matches)}

Beoordeel de tekst van de cursist in de context van de opdracht. Geef je antwoord als strikte JSON met exact deze vorm:
{
  "score": <getal 0-100, hoe goed de tekst voldoet aan de opdracht en correct Nederlands is>,
  "strengths": [<korte Nederlandse zinnen over wat goed ging, max 4>],
  "improvements": [<korte Nederlandse zinnen met concrete verbeterpunten, max 4>],
  "correctedText": "<een verbeterde/gecorrigeerde versie van de tekst van de cursist, in het Nederlands>"
}`;

  try {
    const feedback = await generateJson<WritingFeedback>(prompt, { temperature: 0.3 });
    return NextResponse.json(feedback);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Onbekende fout." },
      { status: 502 },
    );
  }
}
