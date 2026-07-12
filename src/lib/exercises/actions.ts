"use server";

import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

export async function recordExerciseAttempt(params: {
  exerciseId: string;
  response: Json;
  aiFeedback?: Json;
  score?: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Niet ingelogd.");

  await supabase.from("exercise_attempts").insert({
    user_id: user.id,
    exercise_id: params.exerciseId,
    response: params.response,
    ai_feedback: params.aiFeedback ?? null,
    score: params.score ?? null,
  });
}
