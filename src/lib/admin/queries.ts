import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AccessStatus, UserRole } from "@/types/database";

export interface AdminUserRow {
  id: string;
  email: string;
  fullName: string | null;
  nativeLanguage: string | null;
  targetLevel: string | null;
  role: UserRole;
  accessStatus: AccessStatus;
  createdAt: string;
}

/** Combines auth.users (for email) with profiles (for role/access) — admin-only. */
export async function listUsers(): Promise<AdminUserRow[]> {
  const admin = createAdminClient();
  const supabase = await createClient();

  const [{ data: authData }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    supabase
      .from("profiles")
      .select("id, full_name, native_language, target_level, role, access_status, created_at"),
  ]);

  const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return (authData?.users ?? [])
    .map((authUser) => {
      const profile = profileById.get(authUser.id);
      return {
        id: authUser.id,
        email: authUser.email ?? "(geen e-mail)",
        fullName: profile?.full_name ?? null,
        nativeLanguage: profile?.native_language ?? null,
        targetLevel: profile?.target_level ?? null,
        role: (profile?.role ?? "user") as UserRole,
        accessStatus: (profile?.access_status ?? "pending") as AccessStatus,
        createdAt: profile?.created_at ?? authUser.created_at,
      };
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getUserDetail(userId: string): Promise<AdminUserRow | null> {
  const users = await listUsers();
  return users.find((u) => u.id === userId) ?? null;
}
