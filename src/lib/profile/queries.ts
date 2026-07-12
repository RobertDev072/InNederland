import { createClient } from "@/lib/supabase/server";
import type { AccessStatus, UserRole } from "@/types/database";
import { AVAILABLE_LEVELS, LEVEL_CODES, type LevelCode } from "@/types/content";

export interface CurrentProfile {
  id: string;
  fullName: string | null;
  nativeLanguage: string | null;
  targetLevel: string | null;
  targetExamDate: string | null;
  minutesPerDay: number | null;
  role: UserRole;
  accessStatus: AccessStatus;
  onboardingCompleted: boolean;
}

/** Mirrors the handle_new_user() bootstrap rule in supabase/migrations/0004_access_control.sql. */
const BOOTSTRAP_ADMIN_EMAIL = "rb085@icloud.com";

/**
 * Returns the user's profile row, creating it on the fly if the auth-trigger somehow didn't
 * (e.g. it was added after the account already existed). Safe to call on every request — it's a
 * no-op once the row exists.
 */
async function ensureProfileRow(
  userId: string,
  email: string | null | undefined,
): Promise<CurrentProfile | null> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select(
      "id, full_name, native_language, target_level, target_exam_date, minutes_per_day, role, access_status, onboarding_completed",
    )
    .eq("id", userId)
    .maybeSingle();

  if (existing) {
    return {
      id: existing.id,
      fullName: existing.full_name,
      nativeLanguage: existing.native_language,
      targetLevel: existing.target_level,
      targetExamDate: existing.target_exam_date,
      minutesPerDay: existing.minutes_per_day,
      role: existing.role,
      accessStatus: existing.access_status,
      onboardingCompleted: existing.onboarding_completed,
    };
  }

  const isBootstrapAdmin = email === BOOTSTRAP_ADMIN_EMAIL;
  const { data: created } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      role: isBootstrapAdmin ? "admin" : "user",
      access_status: isBootstrapAdmin ? "active" : "pending",
      target_level: "A2",
      onboarding_completed: true,
    })
    .select(
      "id, full_name, native_language, target_level, target_exam_date, minutes_per_day, role, access_status, onboarding_completed",
    )
    .single();

  if (!created) return null;

  return {
    id: created.id,
    fullName: created.full_name,
    nativeLanguage: created.native_language,
    targetLevel: created.target_level,
    targetExamDate: created.target_exam_date,
    minutesPerDay: created.minutes_per_day,
    role: created.role,
    accessStatus: created.access_status,
    onboardingCompleted: created.onboarding_completed,
  };
}

/** Returns the signed-in user's profile (self-healing), or null if unauthenticated. */
export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return ensureProfileRow(user.id, user.email);
}

/** Admins and users with an active (paid, WhatsApp-confirmed) subscription see everything. */
export function hasFullAccess(profile: Pick<CurrentProfile, "role" | "accessStatus"> | null): boolean {
  return profile?.role === "admin" || profile?.accessStatus === "active";
}

/** Admins can browse/manage every level, even ones with no content yet — regular users are limited to AVAILABLE_LEVELS. */
export function isLevelAvailable(
  level: LevelCode,
  profile: Pick<CurrentProfile, "role"> | null,
): boolean {
  return profile?.role === "admin" || AVAILABLE_LEVELS.includes(level);
}

/**
 * Which level a skill page should show. Regular users are always locked to their own
 * profile.targetLevel. Admins can override via `?level=` (the LevelSwitcher) so they can browse
 * and manage every level, not just whichever one their own account happens to be set to.
 */
export function resolveViewLevel(
  profile: Pick<CurrentProfile, "role" | "targetLevel"> | null,
  requestedLevel: string | undefined,
): LevelCode | null {
  if (
    profile?.role === "admin" &&
    requestedLevel &&
    (LEVEL_CODES as readonly string[]).includes(requestedLevel)
  ) {
    return requestedLevel as LevelCode;
  }
  return (profile?.targetLevel as LevelCode | null) ?? null;
}
