import type { ChatMessage } from "@/lib/ai/gemini";

/**
 * Talks to the self-hosted Ollama backend (FastAPI auth-proxy on Railway). Same interface as the
 * Gemini provider so the rest of the app doesn't care which model powers it. Configured via
 * OLLAMA_BACKEND_URL (+ optional OLLAMA_BACKEND_KEY).
 */

interface GenerateOptions {
  systemInstruction?: string;
  temperature?: number;
}

function baseUrl(): string {
  const url = process.env.OLLAMA_BACKEND_URL;
  if (!url) throw new Error("OLLAMA_BACKEND_URL ontbreekt in de omgevingsvariabelen.");
  return url.replace(/\/$/, "");
}

function headers(): Record<string, string> {
  const key = process.env.OLLAMA_BACKEND_KEY;
  return {
    "Content-Type": "application/json",
    ...(key ? { Authorization: `Bearer ${key}` } : {}),
  };
}

export async function generateText(prompt: string, options: GenerateOptions = {}): Promise<string> {
  const res = await fetch(`${baseUrl()}/generate`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      prompt,
      system: options.systemInstruction,
      temperature: options.temperature ?? 0.4,
    }),
  });

  if (!res.ok) {
    throw new Error(`AI-backend fout (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { text?: string };
  return (data.text ?? "").trim();
}

export async function generateJson<T>(prompt: string, options: GenerateOptions = {}): Promise<T> {
  const res = await fetch(`${baseUrl()}/generate`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      prompt,
      system: options.systemInstruction,
      temperature: options.temperature ?? 0.3,
      json: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`AI-backend fout (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { text?: string };
  const cleaned = (data.text ?? "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  return JSON.parse(cleaned) as T;
}

export async function* streamChat(
  history: ChatMessage[],
  options: GenerateOptions = {},
): AsyncGenerator<string> {
  const res = await fetch(`${baseUrl()}/chat`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      messages: history,
      system: options.systemInstruction,
      temperature: options.temperature ?? 0.6,
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`AI-backend streaming mislukt (${res.status}).`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    if (chunk) yield chunk;
  }
}
