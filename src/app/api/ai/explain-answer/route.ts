import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai/gemini";

interface ExplainAnswerBody {
  question: string;
  options: string[];
  correctIndex: number;
  chosenIndex: number;
  nativeLanguage?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ExplainAnswerBody>;
  const { question, options, correctIndex, chosenIndex, nativeLanguage } = body;

  if (!question || !Array.isArray(options) || typeof correctIndex !== "number") {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const prompt = `Je bent een NT2-docent Nederlands (inburgeringsniveau). Een cursist beantwoordde een meerkeuzevraag fout.
Vraag: "${question}"
Opties: ${options.map((option, index) => `${index}. ${option}`).join(", ")}
Gekozen antwoord: ${options[chosenIndex ?? -1] ?? "(geen)"}
Juiste antwoord: ${options[correctIndex]}

Leg in maximaal 3 korte zinnen in eenvoudig Nederlands (A2-niveau) uit waarom het juiste antwoord klopt en het gekozen antwoord niet.${
    nativeLanguage ? ` Voeg daarna een korte vertaling van je uitleg toe in het ${nativeLanguage}.` : ""
  }`;

  try {
    const explanation = await generateText(prompt, { temperature: 0.3 });
    return NextResponse.json({ explanation });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Onbekende fout." },
      { status: 502 },
    );
  }
}
