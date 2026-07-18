import type { ExerciseType, Json } from "@/types/database";

/**
 * Shared contract for the shape of `exercises.content` / `exercises.correct_answer`
 * (both `jsonb` / untyped `Json` at the DB level) per exercise type. Seed content
 * and the exercise UIs must both conform to this — it's the single source of truth.
 */

export interface ReadingTextContent {
  text: string;
  /** Optional admin-uploaded illustrative image (public URL from the lesson-media storage bucket). */
  imageUrl?: string;
}

/** One turn in a spoken dialogue. speaker "m" = male voice, "v" = female voice (browser TTS). */
export interface DialogueLine {
  speaker: "m" | "v";
  /** Optional display name/label for the speaker (e.g. "Anna", "Meneer De Vries"). */
  name?: string;
  text: string;
}

export interface ListeningClipContent {
  /** Read aloud via browser text-to-speech. Optional when a youtubeVideoId or dialogue is provided instead. */
  script?: string;
  /** Structured dialogue read aloud with alternating man/woman voices. */
  dialogue?: DialogueLine[];
  /** YouTube video id (not a full URL) — rendered as an embedded, playable iframe. */
  youtubeVideoId?: string;
}

export interface WritingTaskContent {
  instructions: string;
  minWords?: number;
  /** Optional stored example answer, shown for self-check (no AI needed). */
  modelAnswer?: string;
}

export interface SpeakingPromptContent {
  scenario: string;
  expectedPoints?: string[];
  /** Optional reference/example YouTube video shown above the recording UI. */
  youtubeVideoId?: string;
  /** Optional admin-uploaded illustrative image (public URL from the lesson-media storage bucket). */
  imageUrl?: string;
  /** Optional stored example answer, shown for self-check (no AI needed). */
  modelAnswer?: string;
}

export interface MultipleChoiceContent {
  question: string;
  options: string[];
}
export interface MultipleChoiceAnswer {
  correctIndex: number;
  explanation?: string;
}

export interface OpenTextContent {
  question: string;
}
export interface OpenTextAnswer {
  answer: string;
  explanation?: string;
}

export type ContentByType = {
  reading_text: ReadingTextContent;
  listening_clip: ListeningClipContent;
  writing_task: WritingTaskContent;
  speaking_prompt: SpeakingPromptContent;
  multiple_choice: MultipleChoiceContent;
  open_text: OpenTextContent;
};

export type AnswerByType = {
  multiple_choice: MultipleChoiceAnswer;
  open_text: OpenTextAnswer;
};

export function asContent<T extends ExerciseType>(_type: T, content: Json): ContentByType[T] {
  return content as unknown as ContentByType[T];
}

export function asAnswer<T extends keyof AnswerByType>(
  _type: T,
  answer: Json | null,
): AnswerByType[T] | null {
  return answer as unknown as AnswerByType[T] | null;
}

/**
 * Rich pedagogical sections shown at the top of a lesson (stored in lessons.content jsonb).
 * The interactive parts (reading text, dialogue, questions, tasks) live in the exercises table.
 * All content stays in Dutch; the AI "explain word" feature translates on demand.
 */
export interface LessonVocabularyItem {
  word: string;
  /** Short explanation in simple Dutch (A-level friendly). */
  explanation?: string;
  /** Example sentence using the word. */
  example?: string;
}

export interface LessonContent {
  intro?: string;
  learningGoals?: string[];
  vocabulary?: LessonVocabularyItem[];
  grammar?: { heading: string; body: string }[];
  exampleSentences?: string[];
}

export function asLessonContent(content: Json | null): LessonContent | null {
  return content as unknown as LessonContent | null;
}

/** KNM topics don't use the lessons/exercises tables — they have their own simple content shape. */
export interface KnmCheckQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface KnmTopicContent {
  sections: { heading: string; body: string }[];
  checkQuestions?: KnmCheckQuestion[];
}
