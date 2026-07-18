import * as gemini from "@/lib/ai/gemini";
import * as ollama from "@/lib/ai/ollama";
import type { ChatMessage } from "@/lib/ai/gemini";

/**
 * Provider-agnostic entry point for the app's AI features. Prefers the self-hosted Ollama backend
 * (OLLAMA_BACKEND_URL) when configured, otherwise falls back to Google Gemini (GEMINI_API_KEY).
 * When neither is set, isAiConfigured() is false and the API routes degrade gracefully.
 */

const useOllama = Boolean(process.env.OLLAMA_BACKEND_URL);

export function isAiConfigured(): boolean {
  return Boolean(process.env.OLLAMA_BACKEND_URL) || Boolean(process.env.GEMINI_API_KEY);
}

interface GenerateOptions {
  systemInstruction?: string;
  temperature?: number;
}

export function generateText(prompt: string, options?: GenerateOptions): Promise<string> {
  return useOllama ? ollama.generateText(prompt, options) : gemini.generateText(prompt, options);
}

export function generateJson<T>(prompt: string, options?: GenerateOptions): Promise<T> {
  return useOllama ? ollama.generateJson<T>(prompt, options) : gemini.generateJson<T>(prompt, options);
}

export function streamChat(
  history: ChatMessage[],
  options?: GenerateOptions,
): AsyncGenerator<string> {
  return useOllama ? ollama.streamChat(history, options) : gemini.streamChat(history, options);
}

export type { ChatMessage };
