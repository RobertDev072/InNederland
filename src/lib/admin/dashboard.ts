import { createClient } from "@/lib/supabase/server";

export interface AdminDashboardStats {
  usersByStatus: { active: number; pending: number; blocked: number };
  totalUsers: number;
  totalAdmins: number;
  lessonsByLevel: Record<string, number>;
  totalLessons: number;
  totalExercises: number;
  totalKnmTopics: number;
  totalMockExams: number;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = await createClient();

  const [profilesRes, lessonsRes, exercisesRes, knmRes, examsRes] = await Promise.all([
    supabase.from("profiles").select("role, access_status"),
    supabase.from("lessons").select("level_code"),
    supabase.from("exercises").select("id", { count: "exact", head: true }),
    supabase.from("knm_topics").select("id", { count: "exact", head: true }),
    supabase.from("mock_exams").select("id", { count: "exact", head: true }),
  ]);

  const profiles = profilesRes.data ?? [];
  const lessons = lessonsRes.data ?? [];

  const usersByStatus = { active: 0, pending: 0, blocked: 0 };
  let totalAdmins = 0;
  for (const profile of profiles) {
    if (profile.access_status in usersByStatus) {
      usersByStatus[profile.access_status as keyof typeof usersByStatus] += 1;
    }
    if (profile.role === "admin") totalAdmins += 1;
  }

  const lessonsByLevel: Record<string, number> = {};
  for (const lesson of lessons) {
    lessonsByLevel[lesson.level_code] = (lessonsByLevel[lesson.level_code] ?? 0) + 1;
  }

  return {
    usersByStatus,
    totalUsers: profiles.length,
    totalAdmins,
    lessonsByLevel,
    totalLessons: lessons.length,
    totalExercises: exercisesRes.count ?? 0,
    totalKnmTopics: knmRes.count ?? 0,
    totalMockExams: examsRes.count ?? 0,
  };
}
