import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { streamChat } from "@/lib/ai/gemini";

const COACH_SYSTEM_PROMPT = `Je bent de AI-examencoach van InNederland.ai: een vriendelijke, geduldige en
motiverende docent Nederlands als tweede taal (NT2) die cursisten helpt zich voor te bereiden op het
inburgeringsexamen en het NT2-examen (niveau A1 t/m B1/B2).

Antwoord standaard in eenvoudig, duidelijk Nederlands (rond A2-niveau), met korte zinnen en concrete
voorbeelden. Als de cursist erom vraagt (bijvoorbeeld "leg uit in het Engels/Arabisch/..."), mag je een
uitleg geven in hun moedertaal, maar kom daarna terug op het Nederlands.

Blijf altijd warm, geduldig en bemoedigend, ook als iemand fouten maakt of iets niet begrijpt. Geef
praktische tips, korte oefeningen en voorbeeldzinnen. Houd antwoorden kort en behapbaar, tenzij de cursist
zelf om meer detail vraagt.

Blijf uitsluitend gericht op het leren van Nederlands en examenvoorbereiding: spreken, luisteren, lezen,
schrijven en Kennis van de Nederlandse Maatschappij (KNM). Als een vraag hier niets mee te maken heeft, leid
het gesprek vriendelijk en kort terug naar deze onderwerpen.`;

interface CoachRequestBody {
  conversationId?: string;
  message: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<CoachRequestBody> | null;
  const message = body?.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  let conversationId: string;

  if (body?.conversationId) {
    conversationId = body.conversationId;
  } else {
    const { data: conversation, error: conversationError } = await supabase
      .from("coach_conversations")
      .insert({ user_id: user.id })
      .select("id")
      .single();

    if (conversationError || !conversation) {
      return NextResponse.json({ error: "Kon geen gesprek starten." }, { status: 500 });
    }

    conversationId = conversation.id;
  }

  await supabase.from("coach_messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: message,
  });

  const { data: historyRows } = await supabase
    .from("coach_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  const history = historyRows ?? [];

  const stream = new ReadableStream({
    async start(controller) {
      let accumulated = "";
      try {
        for await (const chunk of streamChat(
          history.map((entry) => ({ role: entry.role, content: entry.content })),
          { systemInstruction: COACH_SYSTEM_PROMPT },
        )) {
          accumulated += chunk;
          controller.enqueue(new TextEncoder().encode(chunk));
        }

        await supabase.from("coach_messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: accumulated,
        });
      } catch {
        controller.enqueue(
          new TextEncoder().encode("Sorry, er ging iets mis. Probeer het later opnieuw."),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "x-conversation-id": conversationId,
    },
  });
}
