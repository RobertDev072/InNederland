const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

interface GeminiContent {
  role: "user" | "model";
  parts: { text: string }[];
}

interface GenerateOptions {
  systemInstruction?: string;
  temperature?: number;
}

interface GeminiCandidate {
  content?: { parts?: { text?: string }[] };
}

function endpoint(model: string, method: "generateContent" | "streamGenerateContent") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY ontbreekt in de omgevingsvariabelen.");
  const sse = method === "streamGenerateContent" ? "&alt=sse" : "";
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:${method}?key=${key}${sse}`;
}

function extractText(candidate: GeminiCandidate | undefined) {
  return candidate?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
}

/** Single-shot text generation — used for writing/speaking feedback and word explanations. */
export async function generateText(prompt: string, options: GenerateOptions = {}): Promise<string> {
  const res = await fetch(endpoint(DEFAULT_MODEL, "generateContent"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }] satisfies GeminiContent[],
      ...(options.systemInstruction
        ? { systemInstruction: { parts: [{ text: options.systemInstruction }] } }
        : {}),
      generationConfig: { temperature: options.temperature ?? 0.4 },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini-aanvraag mislukt (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { candidates?: GeminiCandidate[] };
  return extractText(data.candidates?.[0]).trim();
}

/** Same as generateText, but asks for and parses a strict JSON response. */
export async function generateJson<T>(prompt: string, options: GenerateOptions = {}): Promise<T> {
  const text = await generateText(
    `${prompt}\n\nAntwoord uitsluitend met geldige JSON, zonder markdown-codeblok en zonder uitleg erbuiten.`,
    options,
  );
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  return JSON.parse(cleaned) as T;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Streams response text chunks for the AI coach chat. */
export async function* streamChat(
  history: ChatMessage[],
  options: GenerateOptions = {},
): AsyncGenerator<string> {
  const contents: GeminiContent[] = history.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  const res = await fetch(endpoint(DEFAULT_MODEL, "streamGenerateContent"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      ...(options.systemInstruction
        ? { systemInstruction: { parts: [{ text: options.systemInstruction }] } }
        : {}),
      generationConfig: { temperature: options.temperature ?? 0.6 },
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Gemini-streaming mislukt (${res.status}): ${await res.text()}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (!jsonStr || jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr) as { candidates?: GeminiCandidate[] };
        const chunk = extractText(parsed.candidates?.[0]);
        if (chunk) yield chunk;
      } catch {
        // Ignore partial/non-JSON SSE lines.
      }
    }
  }
}
