"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/guard";
import { createClient } from "@/lib/supabase/server";
import { EXAM_SKILLS } from "@/lib/admin/content/exam-skills";
import type { MockExamStructure } from "@/lib/mock-exam/queries";

export interface AdminMockExamRow {
  id: string;
  levelCode: string;
  title: string;
  structure: MockExamStructure;
}

export async function listMockExams(): Promise<AdminMockExamRow[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("mock_exams").select("id, level_code, title, structure");

  return (data ?? []).map((exam) => ({
    id: exam.id,
    levelCode: exam.level_code,
    title: exam.title,
    structure: exam.structure as unknown as MockExamStructure,
  }));
}

export async function getMockExamForAdmin(examId: string): Promise<AdminMockExamRow | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("mock_exams")
    .select("id, level_code, title, structure")
    .eq("id", examId)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    levelCode: data.level_code,
    title: data.title,
    structure: data.structure as unknown as MockExamStructure,
  };
}

export interface AdminFormState {
  error?: string;
}

function buildStructureFromForm(formData: FormData): MockExamStructure {
  const sections = EXAM_SKILLS.map((skill) => ({
    skill,
    exerciseCount: Number(formData.get(`count_${skill}`) ?? 0),
  })).filter((section) => Number.isFinite(section.exerciseCount) && section.exerciseCount > 0);

  return { sections };
}

export async function createMockExam(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const levelCode = String(formData.get("level_code") ?? "");
  const title = String(formData.get("title") ?? "").trim();

  if (!levelCode || !title) {
    return { error: "Vul niveau en titel in." };
  }

  const structure = buildStructureFromForm(formData);
  if (structure.sections.length === 0) {
    return { error: "Kies minimaal één vaardigheid met een aantal oefeningen groter dan 0." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("mock_exams").insert({
    level_code: levelCode,
    title,
    structure: structure as unknown as never,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/examens");
  redirect("/admin/examens");
}

export async function updateMockExam(
  examId: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Titel is verplicht." };

  const structure = buildStructureFromForm(formData);
  if (structure.sections.length === 0) {
    return { error: "Kies minimaal één vaardigheid met een aantal oefeningen groter dan 0." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("mock_exams")
    .update({ title, structure: structure as unknown as never })
    .eq("id", examId);

  if (error) return { error: error.message };

  revalidatePath("/admin/examens");
  revalidatePath(`/admin/examens/${examId}`);
  return {};
}

export async function deleteMockExam(examId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("mock_exams").delete().eq("id", examId);
  revalidatePath("/admin/examens");
  redirect("/admin/examens");
}
