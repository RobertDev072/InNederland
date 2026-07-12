import { createClient } from "@/lib/supabase/server";
import type { ExerciseType, Json } from "@/types/database";
import type { LevelCode, SkillCode } from "@/types/content";

export interface MockExamSection {
  skill: SkillCode;
  exerciseCount: number;
}

export interface MockExamStructure {
  sections: MockExamSection[];
}

export interface MockExamSummary {
  id: string;
  title: string;
  structure: MockExamStructure;
}

export interface MockExamExercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  content: Json;
  correctAnswer: Json | null;
  sortOrder: number;
  skillCode: SkillCode;
}

/** The single mock exam seeded for a level (there's exactly one per level for now). */
export async function getMockExamForLevel(levelCode: LevelCode): Promise<MockExamSummary | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mock_exams")
    .select("id, title, structure")
    .eq("level_code", levelCode)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    structure: data.structure as unknown as MockExamStructure,
  };
}

export async function getMockExamById(examId: string): Promise<MockExamSummary | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mock_exams")
    .select("id, title, structure")
    .eq("id", examId)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    structure: data.structure as unknown as MockExamStructure,
  };
}

/**
 * For each section, finds lessons matching level+skill, then exercises belonging to those
 * lessons, sorted by lesson order then exercise order (in JS, kept deliberately simple), and
 * takes the first `exerciseCount`. Returns a flat list tagged with the section's skill.
 */
export async function getExamExercises(
  levelCode: LevelCode,
  structure: MockExamStructure,
): Promise<MockExamExercise[]> {
  const supabase = await createClient();
  const results: MockExamExercise[] = [];

  for (const section of structure.sections ?? []) {
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id, sort_order")
      .eq("level_code", levelCode)
      .eq("skill_code", section.skill)
      .order("sort_order", { ascending: true });

    const lessonList = lessons ?? [];
    if (lessonList.length === 0) continue;

    const lessonSortOrder = new Map(lessonList.map((lesson) => [lesson.id, lesson.sort_order]));
    const lessonIds = lessonList.map((lesson) => lesson.id);

    const { data: exercises } = await supabase
      .from("exercises")
      .select("id, lesson_id, type, prompt, content, correct_answer, sort_order")
      .in("lesson_id", lessonIds);

    const sorted = (exercises ?? []).slice().sort((a, b) => {
      const lessonDiff =
        (lessonSortOrder.get(a.lesson_id) ?? 0) - (lessonSortOrder.get(b.lesson_id) ?? 0);
      if (lessonDiff !== 0) return lessonDiff;
      return a.sort_order - b.sort_order;
    });

    for (const exercise of sorted.slice(0, section.exerciseCount)) {
      results.push({
        id: exercise.id,
        type: exercise.type,
        prompt: exercise.prompt,
        content: exercise.content,
        correctAnswer: exercise.correct_answer,
        sortOrder: exercise.sort_order,
        skillCode: section.skill,
      });
    }
  }

  return results;
}
