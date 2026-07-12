import { createClient } from "@/lib/supabase/server";
import { AVAILABLE_LEVELS, type LevelCode } from "@/types/content";

export interface StudyPlanItemView {
  id: string;
  status: "todo" | "done";
  lessonId: string;
  lessonTitle: string;
  skillCode: string;
}

export interface StudyPlanView {
  id: string;
  weekNumber: number;
  items: StudyPlanItemView[];
}

/**
 * Returns the user's current study plan, generating a rule-based Week 1
 * (first lesson per skill for their target level) the first time they land
 * on the dashboard. Returns null when there's no content for their level yet.
 */
export async function ensureCurrentStudyPlan(
  userId: string,
  targetLevel: LevelCode | null,
): Promise<StudyPlanView | null> {
  const supabase = await createClient();

  const { data: existingPlan } = await supabase
    .from("study_plans")
    .select("id, week_number")
    .eq("user_id", userId)
    .order("week_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  let plan = existingPlan;

  if (!plan) {
    if (!targetLevel || !AVAILABLE_LEVELS.includes(targetLevel)) {
      return null;
    }

    const { data: lessons } = await supabase
      .from("lessons")
      .select("id, title, skill_code")
      .eq("level_code", targetLevel)
      .order("sort_order", { ascending: true });

    if (!lessons || lessons.length === 0) return null;

    const seenSkills = new Set<string>();
    const weekOneLessons = lessons.filter((lesson) => {
      if (seenSkills.has(lesson.skill_code)) return false;
      seenSkills.add(lesson.skill_code);
      return true;
    });

    const { data: newPlan, error: planError } = await supabase
      .from("study_plans")
      .insert({ user_id: userId, week_number: 1 })
      .select("id, week_number")
      .single();

    if (planError || !newPlan) return null;
    plan = newPlan;

    if (weekOneLessons.length > 0) {
      await supabase.from("study_plan_items").insert(
        weekOneLessons.map((lesson) => ({
          study_plan_id: newPlan.id,
          lesson_id: lesson.id,
          status: "todo" as const,
        })),
      );
    }
  }

  const { data: items } = await supabase
    .from("study_plan_items")
    .select("id, status, lesson_id")
    .eq("study_plan_id", plan.id);

  if (!items || items.length === 0) {
    return { id: plan.id, weekNumber: plan.week_number, items: [] };
  }

  const lessonIds = items.map((item) => item.lesson_id);
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, skill_code")
    .in("id", lessonIds);

  const lessonById = new Map((lessons ?? []).map((lesson) => [lesson.id, lesson]));

  return {
    id: plan.id,
    weekNumber: plan.week_number,
    items: items.map((item) => {
      const lesson = lessonById.get(item.lesson_id);
      return {
        id: item.id,
        status: item.status,
        lessonId: item.lesson_id,
        lessonTitle: lesson?.title ?? "Les",
        skillCode: lesson?.skill_code ?? "",
      };
    }),
  };
}
