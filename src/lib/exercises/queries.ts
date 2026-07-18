import { createClient } from "@/lib/supabase/server";
import type { ExerciseType, Json } from "@/types/database";
import type { LevelCode, SkillCode } from "@/types/content";

export interface LessonSummary {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isFree: boolean;
}

export interface ExerciseView {
  id: string;
  type: ExerciseType;
  prompt: string;
  content: Json;
  correctAnswer: Json | null;
  sortOrder: number;
}

export async function getLessonsForSkill(
  levelCode: LevelCode,
  skillCode: SkillCode,
): Promise<LessonSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lessons")
    .select("id, title, description, sort_order, is_free")
    .eq("level_code", levelCode)
    .eq("skill_code", skillCode)
    .order("sort_order", { ascending: true });

  return (data ?? []).map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    sortOrder: lesson.sort_order,
    isFree: lesson.is_free,
  }));
}

export async function getLessonWithExercises(lessonId: string): Promise<{
  lesson: {
    id: string;
    title: string;
    description: string | null;
    levelCode: string;
    skillCode: string;
    isFree: boolean;
    content: Json | null;
  };
  exercises: ExerciseView[];
} | null> {
  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, title, description, level_code, skill_code, is_free, content")
    .eq("id", lessonId)
    .single();

  if (!lesson) return null;

  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, type, prompt, content, correct_answer, sort_order")
    .eq("lesson_id", lessonId)
    .order("sort_order", { ascending: true });

  return {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      levelCode: lesson.level_code,
      skillCode: lesson.skill_code,
      isFree: lesson.is_free,
      content: lesson.content,
    },
    exercises: (exercises ?? []).map((exercise) => ({
      id: exercise.id,
      type: exercise.type,
      prompt: exercise.prompt,
      content: exercise.content,
      correctAnswer: exercise.correct_answer,
      sortOrder: exercise.sort_order,
    })),
  };
}
