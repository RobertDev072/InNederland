"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { StudyPlanItemStatus } from "@/types/database";

export async function toggleStudyPlanItem(itemId: string, nextStatus: StudyPlanItemStatus) {
  const supabase = await createClient();
  await supabase.from("study_plan_items").update({ status: nextStatus }).eq("id", itemId);
  revalidatePath("/dashboard");
}
