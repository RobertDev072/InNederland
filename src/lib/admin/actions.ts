"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/guard";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AccessStatus, UserRole } from "@/types/database";
import { LEVEL_CODES, type LevelCode } from "@/types/content";

export async function setUserRole(userId: string, role: UserRole) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/admin");
  revalidatePath(`/admin/gebruikers/${userId}`);
}

export async function setAccessStatus(userId: string, status: AccessStatus) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("profiles").update({ access_status: status }).eq("id", userId);

  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(userId, {
    ban_duration: status === "blocked" ? "87600h" : "none",
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/gebruikers/${userId}`);
}

export interface CreateUserResult {
  error?: string;
}

export async function createUserAccount(
  _prevState: CreateUserResult,
  formData: FormData,
): Promise<CreateUserResult> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const nativeLanguage = String(formData.get("native_language") ?? "").trim();
  const targetLevel = String(formData.get("target_level") ?? "");
  const activateImmediately = formData.get("activate_immediately") === "on";

  if (!email || !password) {
    return { error: "Vul e-mailadres en wachtwoord in." };
  }
  if (!LEVEL_CODES.includes(targetLevel as LevelCode)) {
    return { error: "Kies een niveau voor deze gebruiker." };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    return { error: error?.message ?? "Aanmaken van account is mislukt." };
  }

  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      native_language: nativeLanguage || null,
      target_level: targetLevel,
      access_status: activateImmediately ? "active" : "pending",
      onboarding_completed: true,
    })
    .eq("id", data.user.id);

  revalidatePath("/admin");
  return {};
}

export async function setUserLevel(userId: string, targetLevel: LevelCode) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("profiles").update({ target_level: targetLevel }).eq("id", userId);
  revalidatePath("/admin");
  revalidatePath(`/admin/gebruikers/${userId}`);
}

export interface ResetPasswordResult {
  error?: string;
  success?: boolean;
}

export async function resetUserPassword(
  userId: string,
  _prevState: ResetPasswordResult,
  formData: FormData,
): Promise<ResetPasswordResult> {
  await requireAdmin();

  const newPassword = String(formData.get("password") ?? "");
  if (newPassword.length < 8) {
    return { error: "Wachtwoord moet minimaal 8 tekens zijn." };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, { password: newPassword });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function deleteUserAccount(userId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(userId);
  revalidatePath("/admin");
}
