"use client";

import { useCallback, useRef, useState } from "react";
import type { DialogueLine } from "@/types/exercise-content";

/**
 * Best-effort pick of a male/female Dutch voice from the browser's available voices.
 * Availability varies per device; when only one Dutch voice exists we slightly vary the
 * pitch per speaker so the two roles are still distinguishable.
 */
function pickDutchVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return { male: null, female: null } as {
      male: SpeechSynthesisVoice | null;
      female: SpeechSynthesisVoice | null;
    };
  }
  const voices = window.speechSynthesis.getVoices();
  const dutch = voices.filter((v) => v.lang.toLowerCase().startsWith("nl"));
  const pool = dutch.length > 0 ? dutch : voices;

  const femaleHint = /female|vrouw|anna|lotte|femke|claire|google nederlands/i;
  const maleHint = /male|man|xander|ruben|daan/i;

  const female = pool.find((v) => femaleHint.test(v.name)) ?? pool[0] ?? null;
  const male = pool.find((v) => maleHint.test(v.name)) ?? pool[1] ?? pool[0] ?? null;

  return { male, female };
}

/** Free, browser-native text-to-speech — generates spoken Dutch on the fly for listening exercises. */
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
  );
  const cancelledRef = useRef(false);

  const speak = useCallback((text: string, lang: string = "nl-NL") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    cancelledRef.current = false;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  /** Speaks a dialogue line by line, alternating male/female voice per speaker. */
  const speakDialogue = useCallback((lines: DialogueLine[], lang: string = "nl-NL") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    cancelledRef.current = false;
    window.speechSynthesis.cancel();

    const { male, female } = pickDutchVoices();
    const onlyOneVoice = !male || !female || male === female;

    setIsSpeaking(true);

    lines.forEach((line, index) => {
      const utterance = new SpeechSynthesisUtterance(line.text);
      utterance.lang = lang;
      const voice = line.speaker === "m" ? male : female;
      if (voice) utterance.voice = voice;
      // If the device has only one Dutch voice, differentiate roles by pitch.
      if (onlyOneVoice) utterance.pitch = line.speaker === "m" ? 0.8 : 1.2;
      if (index === lines.length - 1) {
        utterance.onend = () => {
          if (!cancelledRef.current) setIsSpeaking(false);
        };
      }
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      cancelledRef.current = true;
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return { speak, speakDialogue, stop, isSpeaking, isSupported };
}
