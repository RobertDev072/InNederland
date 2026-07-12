import { NextResponse } from "next/server";
import { generateJson } from "@/lib/ai/gemini";
import type { SpeakingFeedback } from "@/types/feedback";

interface FeedbackSpeakingBody {
  scenario: string;
  expectedPoints?: string[];
  transcript: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<FeedbackSpeakingBody>;
  const { scenario, expectedPoints, transcript } = body;

  if (!scenario || !transcript) {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const prompt = `Je bent een NT2-docent Nederlands die spreekvaardigheid beoordeelt voor het inburgeringsexamen.

Situatie/opdracht: "${scenario}"
${
  expectedPoints && expectedPoints.length > 0
    ? `Punten die de cursist idealiter noemt: ${expectedPoints.map((point) => `"${point}"`).join(", ")}`
    : "Er zijn geen specifieke verplichte punten voor deze opdracht."
}

De cursist sprak dit in (herkend door spraakherkenning, dus let op dat kleine transcriptiefouten geen probleem zijn — beoordeel de inhoud, grammatica en woordkeuze, niet de uitspraak zelf):
"${transcript}"

Beoordeel dit antwoord en geef een strikt JSON-object terug met exact deze vorm:
{
  "score": number tussen 0 en 100 (hoe goed de cursist de opdracht heeft uitgevoerd),
  "strengths": string[] (korte punten in het Nederlands over wat goed ging),
  "improvements": string[] (korte, concrete verbeterpunten in het Nederlands over grammatica, woordkeuze of inhoud),
  "missedPoints": string[] (van de verplichte punten hierboven: welke heeft de cursist niet genoemd; lege array als alles genoemd is of er geen verplichte punten zijn)
}
Gebruik korte, eenvoudige zinnen in het Nederlands (A2-niveau) voor elk punt.`;

  try {
    const feedback = await generateJson<SpeakingFeedback>(prompt, { temperature: 0.4 });
    return NextResponse.json(feedback);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Onbekende fout." },
      { status: 502 },
    );
  }
}
