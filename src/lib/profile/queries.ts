import { createClient } from "@/lib/supabase/server";

export interface CurrentProfile {
  id: string;
  fullName: string | null;
  nativeLanguage: string | null;
  targetLevel: string | null;
  targetExamDate: string | null;
  minutesPerDay: number | null;
}

/** Returns the signed-in user's profile, or null if unauthenticated. */
export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, native_language, target_level, target_exam_date, minutes_per_day")
    .eq("id", user.id)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    nativeLanguage: data.native_language,
    targetLevel: data.target_level,
    targetExamDate: data.target_exam_date,
    minutesPerDay: data.minutes_per_day,
  };
}
