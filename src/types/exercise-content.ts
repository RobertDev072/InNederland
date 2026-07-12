import type { ExerciseType, Json } from "@/types/database";

/**
 * Shared contract for the shape of `exercises.content` / `exercises.correct_answer`
 * (both `jsonb` / untyped `Json` at the DB level) per exercise type. Seed content
 * and the exercise UIs must both conform to this — it's the single source of truth.
 */

export interface ReadingTextContent {
  text: string;
}

export interface ListeningClipContent {
  script: string;
}

export interface WritingTaskContent {
  instructions: string;
  minWords?: number;
}

export interface SpeakingPromptContent {
  scenario: string;
  expectedPoints?: string[];
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
