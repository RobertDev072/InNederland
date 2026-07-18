import { NextResponse } from "next/server";
import { generateText, isAiConfigured } from "@/lib/ai/llm";

interface ExplainWordBody {
  word: string;
  sentence?: string;
  nativeLanguage?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ExplainWordBody>;
  const { word, sentence, nativeLanguage } = body;

  if (!word) {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  if (!isAiConfigured()) {
    return NextResponse.json(
      { explanation: "Woorduitleg via AI is nu niet beschikbaar." },
      { status: 200 },
    );
  }

  const prompt = `Je helpt een inburgeraar (NT2, A2-niveau) die het Nederlandse woord "${word}" niet begrijpt${
    sentence ? ` in de zin: "${sentence}"` : ""
  }.
Leg de betekenis uit in maximaal 2 korte zinnen, in heel eenvoudig Nederlands (A2-niveau).${
    nativeLanguage ? ` Voeg daarna een vertaling van het woord toe in het ${nativeLanguage}.` : ""
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
