"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

export function CoachChat({ nativeLanguage }: { nativeLanguage: string | null }) {
  const t = useTranslations("Coach");
  const SUGGESTED_QUESTIONS = [
    t("suggestionWhyWrong"),
    t("suggestionSimplify"),
    t("suggestionPractice"),
  ];
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      role: "assistant",
      content: "Hoi! Ik ben je AI-examencoach. Waar wil je vandaag mee oefenen?",
    },
  ]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: trimmed }),
      });

      if (!res.ok || !res.body) {
        throw new Error("De coach kon niet antwoorden.");
      }

      const newConversationId = res.headers.get("x-conversation-id");
      if (newConversationId && !conversationId) {
        setConversationId(newConversationId);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;

        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + chunk };
          return next;
        });
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: "Sorry, er ging iets mis. Probeer het opnieuw.",
        };
        return next;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  function handleChipClick(question: string) {
    setInput(question);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm",
                  message.role === "user"
                    ? "bg-orange-500 text-white"
                    : "bg-navy-50 text-navy-800",
                )}
              >
                {message.content || (isStreaming && index === messages.length - 1 ? "…" : "")}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-navy-100 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((question) => (
            <Button
              key={question}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleChipClick(question)}
              disabled={isStreaming}
            >
              {question}
            </Button>
          ))}
        </div>

        {nativeLanguage ? (
          <p className="mb-2 text-xs text-navy-400">
            Tip: je kunt ook vragen om uitleg in het {nativeLanguage}.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("inputPlaceholder")}
            disabled={isStreaming}
          />
          <Button type="submit" disabled={isStreaming || !input.trim()} loading={isStreaming}>
            {t("send")}
          </Button>
        </form>
      </div>
    </div>
  );
}
