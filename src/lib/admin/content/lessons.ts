"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/guard";
import { createClient } from "@/lib/supabase/server";
import type { ExerciseType, Json } from "@/types/database";

export interface AdminLessonRow {
  id: string;
  levelCode: string;
  skillCode: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isFree: boolean;
  exerciseCount: number;
}

export async function listLessons(filters: { level?: string; skill?: string } = {}): Promise<AdminLessonRow[]> {
  await requireAdmin();
  const supabase = await createClient();

  let query = supabase
    .from("lessons")
    .select("id, level_code, skill_code, title, description, sort_order, is_free")
    .order("level_code", { ascending: true })
    .order("skill_code", { ascending: true })
    .order("sort_order", { ascending: true });

  if (filters.level) query = query.eq("level_code", filters.level);
  if (filters.skill) query = query.eq("skill_code", filters.skill);

  const { data: lessons } = await query;
  if (!lessons || lessons.length === 0) return [];

  const { data: exercises } = await supabase
    .from("exercises")
    .select("lesson_id")
    .in(
      "lesson_id",
      lessons.map((lesson) => lesson.id),
    );

  const countByLesson = new Map<string, number>();
  for (const exercise of exercises ?? []) {
    countByLesson.set(exercise.lesson_id, (countByLesson.get(exercise.lesson_id) ?? 0) + 1);
  }

  return lessons.map((lesson) => ({
    id: lesson.id,
    levelCode: lesson.level_code,
    skillCode: lesson.skill_code,
    title: lesson.title,
    description: lesson.description,
    sortOrder: lesson.sort_order,
    isFree: lesson.is_free,
    exerciseCount: countByLesson.get(lesson.id) ?? 0,
  }));
}

export interface AdminExerciseRow {
  id: string;
  type: ExerciseType;
  prompt: string;
  content: Json;
  correctAnswer: Json | null;
  sortOrder: number;
}

export interface AdminLessonDetail {
  id: string;
  levelCode: string;
  skillCode: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isFree: boolean;
}

export async function getLessonForAdmin(
  lessonId: string,
): Promise<{ lesson: AdminLessonDetail; exercises: AdminExerciseRow[] } | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, level_code, skill_code, title, description, sort_order, is_free")
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
      levelCode: lesson.level_code,
      skillCode: lesson.skill_code,
      title: lesson.title,
      description: lesson.description,
      sortOrder: lesson.sort_order,
      isFree: lesson.is_free,
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

export interface AdminFormState {
  error?: string;
}

export async function createLesson(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const levelCode = String(formData.get("level_code") ?? "");
  const skillCode = String(formData.get("skill_code") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 1);
  const isFree = formData.get("is_free") === "on";

  if (!levelCode || !skillCode || !title) {
    return { error: "Vul niveau, vaardigheid en titel in." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .insert({
      level_code: levelCode,
      skill_code: skillCode,
      title,
      description: description || null,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 1,
      is_free: isFree,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Aanmaken is mislukt." };
  }

  revalidatePath("/admin/lessen");
  redirect(`/admin/lessen/${data.id}`);
}

export async function updateLesson(
  lessonId: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 1);
  const isFree = formData.get("is_free") === "on";

  if (!title) return { error: "Titel is verplicht." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("lessons")
    .update({
      title,
      description: description || null,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 1,
      is_free: isFree,
    })
    .eq("id", lessonId);

  if (error) return { error: error.message };

  revalidatePath("/admin/lessen");
  revalidatePath(`/admin/lessen/${lessonId}`);
  return {};
}

export async function deleteLesson(lessonId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("lessons").delete().eq("id", lessonId);
  revalidatePath("/admin/lessen");
  redirect("/admin/lessen");
}

function formStr(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function buildContentFromForm(type: ExerciseType, formData: FormData): Json {
  switch (type) {
    case "reading_text":
      return {
        text: formStr(formData, "text"),
        imageUrl: formStr(formData, "image_url") || undefined,
      } as unknown as Json;
    case "listening_clip":
      return {
        script: formStr(formData, "script") || undefined,
        youtubeVideoId: formStr(formData, "youtube_video_id") || undefined,
      } as unknown as Json;
    case "writing_task": {
      const minWordsRaw = formStr(formData, "min_words");
      return {
        instructions: formStr(formData, "instructions"),
        minWords: minWordsRaw ? Number(minWordsRaw) : undefined,
      } as unknown as Json;
    }
    case "speaking_prompt": {
      const expectedPointsRaw = formStr(formData, "expected_points");
      return {
        scenario: formStr(formData, "scenario"),
        expectedPoints: expectedPointsRaw
          ? expectedPointsRaw
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
          : undefined,
        youtubeVideoId: formStr(formData, "youtube_video_id") || undefined,
        imageUrl: formStr(formData, "image_url") || undefined,
      } as unknown as Json;
    }
    case "multiple_choice": {
      const options = [1, 2, 3, 4]
        .map((n) => formStr(formData, `option_${n}`))
        .filter((option) => option.length > 0);
      return { question: formStr(formData, "question"), options } as unknown as Json;
    }
    case "open_text":
      return { question: formStr(formData, "question") } as unknown as Json;
    default:
      return {} as Json;
  }
}

function buildAnswerFromForm(type: ExerciseType, formData: FormData): Json | null {
  if (type === "multiple_choice") {
    const correctIndex = Number(formStr(formData, "correct_index") || "0");
    const explanation = formStr(formData, "explanation");
    return { correctIndex, explanation: explanation || undefined } as unknown as Json;
  }
  if (type === "open_text") {
    const answer = formStr(formData, "answer");
    if (!answer) return null;
    return { answer, explanation: formStr(formData, "explanation") || undefined } as unknown as Json;
  }
  return null;
}

export async function saveExercise(
  lessonId: string,
  exerciseId: string | null,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const type = String(formData.get("type") ?? "") as ExerciseType;
  const prompt = formStr(formData, "prompt");
  const sortOrder = Number(formData.get("sort_order") ?? 1);

  if (!prompt) return { error: "Vul een prompt/instructie in." };

  const content = buildContentFromForm(type, formData);
  const correctAnswer = buildAnswerFromForm(type, formData);

  const supabase = await createClient();
  const payload = {
    lesson_id: lessonId,
    type,
    prompt,
    content,
    correct_answer: correctAnswer,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 1,
  };

  const { error } = exerciseId
    ? await supabase.from("exercises").update(payload).eq("id", exerciseId)
    : await supabase.from("exercises").insert(payload);

  if (error) return { error: error.message };

  revalidatePath(`/admin/lessen/${lessonId}`);
  redirect(`/admin/lessen/${lessonId}`);
}

export async function deleteExercise(lessonId: string, exerciseId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("exercises").delete().eq("id", exerciseId);
  revalidatePath(`/admin/lessen/${lessonId}`);
}
