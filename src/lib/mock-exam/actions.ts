"use server";

import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

export async function submitMockExam(params: {
  mockExamId: string;
  sectionScores: Json;
  totalScore: number;
  report: Json;
}): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Niet ingelogd.");

  const { data, error } = await supabase
    .from("mock_exam_attempts")
    .insert({
      user_id: user.id,
      mock_exam_id: params.mockExamId,
      completed_at: new Date().toISOString(),
      total_score: params.totalScore,
      section_scores: params.sectionScores,
      report: params.report,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error("Het proefexamen kon niet worden opgeslagen.");
  }

  return data.id;
}
