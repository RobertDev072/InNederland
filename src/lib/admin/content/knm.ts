"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/guard";
import { createClient } from "@/lib/supabase/server";
import type { KnmTopicContent } from "@/types/exercise-content";

export interface AdminKnmTopicRow {
  id: string;
  category: string;
  title: string;
  sortOrder: number;
  isFree: boolean;
  content: KnmTopicContent;
}

export async function listKnmTopics(): Promise<AdminKnmTopicRow[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("knm_topics")
    .select("id, category, title, sort_order, is_free, content")
    .order("sort_order", { ascending: true });

  return (data ?? []).map((topic) => ({
    id: topic.id,
    category: topic.category,
    title: topic.title,
    sortOrder: topic.sort_order,
    isFree: topic.is_free,
    content: topic.content as unknown as KnmTopicContent,
  }));
}

export async function getKnmTopic(topicId: string): Promise<AdminKnmTopicRow | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("knm_topics")
    .select("id, category, title, sort_order, is_free, content")
    .eq("id", topicId)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    category: data.category,
    title: data.title,
    sortOrder: data.sort_order,
    isFree: data.is_free,
    content: data.content as unknown as KnmTopicContent,
  };
}

export interface AdminFormState {
  error?: string;
}

const MAX_SECTIONS = 5;
const MAX_QUESTIONS = 3;

function buildContentFromForm(formData: FormData): KnmTopicContent {
  const str = (name: string) => String(formData.get(name) ?? "").trim();

  const sections = Array.from({ length: MAX_SECTIONS })
    .map((_, index) => ({
      heading: str(`section_heading_${index + 1}`),
      body: str(`section_body_${index + 1}`),
    }))
    .filter((section) => section.heading || section.body);

  const checkQuestions = Array.from({ length: MAX_QUESTIONS })
    .map((_, index) => {
      const question = str(`question_${index + 1}`);
      const options = [1, 2, 3, 4]
        .map((n) => str(`question_${index + 1}_option_${n}`))
        .filter((option) => option.length > 0);
      const correctIndex = Number(str(`question_${index + 1}_correct_index`) || "0");
      return { question, options, correctIndex };
    })
    .filter((question) => question.question && question.options.length >= 2);

  return { sections, checkQuestions: checkQuestions.length > 0 ? checkQuestions : undefined };
}

export async function createKnmTopic(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const category = String(formData.get("category") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 1);
  const isFree = formData.get("is_free") === "on";

  if (!category || !title) {
    return { error: "Vul categorie en titel in." };
  }

  const content = buildContentFromForm(formData);
  if (content.sections.length === 0) {
    return { error: "Voeg minimaal één sectie toe." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knm_topics")
    .insert({
      category,
      title,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 1,
      is_free: isFree,
      content: content as unknown as never,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Aanmaken is mislukt." };
  }

  revalidatePath("/admin/knm");
  redirect(`/admin/knm/${data.id}`);
}

export async function updateKnmTopic(
  topicId: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const category = String(formData.get("category") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 1);
  const isFree = formData.get("is_free") === "on";

  if (!category || !title) return { error: "Vul categorie en titel in." };

  const content = buildContentFromForm(formData);
  if (content.sections.length === 0) {
    return { error: "Voeg minimaal één sectie toe." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("knm_topics")
    .update({
      category,
      title,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 1,
      is_free: isFree,
      content: content as unknown as never,
    })
    .eq("id", topicId);

  if (error) return { error: error.message };

  revalidatePath("/admin/knm");
  revalidatePath(`/admin/knm/${topicId}`);
  return {};
}

export async function deleteKnmTopic(topicId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("knm_topics").delete().eq("id", topicId);
  revalidatePath("/admin/knm");
  redirect("/admin/knm");
}
