"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LEVEL_CODES, type LevelCode } from "@/types/content";

export interface OnboardingFormState {
  error?: string;
}

export async function completeOnboarding(
  _prevState: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const nativeLanguage = String(formData.get("native_language") ?? "").trim();
  const targetLevel = String(formData.get("target_level") ?? "");
  const targetExamDate = String(formData.get("target_exam_date") ?? "");
  const minutesPerDay = Number(formData.get("minutes_per_day") ?? 15);

  if (!nativeLanguage) {
    return { error: "Vertel ons wat je moedertaal is." };
  }
  if (!LEVEL_CODES.includes(targetLevel as LevelCode)) {
    return { error: "Kies het niveau dat je wilt behalen." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      native_language: nativeLanguage,
      target_level: targetLevel,
      target_exam_date: targetExamDate || null,
      minutes_per_day: Number.isFinite(minutesPerDay) ? minutesPerDay : 15,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Opslaan is niet gelukt. Probeer het opnieuw." };
  }

  redirect("/dashboard");
}
