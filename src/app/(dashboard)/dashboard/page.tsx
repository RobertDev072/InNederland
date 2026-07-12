import { createClient } from "@/lib/supabase/server";
import { ensureCurrentStudyPlan } from "@/lib/study-plan/queries";
import { StudyPlanCard } from "@/components/dashboard/study-plan-card";
import { Card, CardContent } from "@/components/ui/card";
import { LevelPill } from "@/components/ui/level-pill";
import { AVAILABLE_LEVELS, LEVEL_CODES, LEVEL_LABELS, type LevelCode } from "@/types/content";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, native_language, target_level, target_exam_date, minutes_per_day")
    .eq("id", user!.id)
    .single();

  const targetLevel = (profile?.target_level as LevelCode | null) ?? null;
  const studyPlan = await ensureCurrentStudyPlan(user!.id, targetLevel);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">
          Welkom terug{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="text-navy-500">
          Doel: {targetLevel ? LEVEL_LABELS[targetLevel] : "nog niet gekozen"}
          {profile?.target_exam_date
            ? ` • Examen op ${new Date(profile.target_exam_date).toLocaleDateString("nl-NL")}`
            : ""}
          {profile?.minutes_per_day ? ` • ${profile.minutes_per_day} min/dag` : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {LEVEL_CODES.map((level) => (
          <LevelPill
            key={level}
            level={level}
            active={level === targetLevel}
            locked={!AVAILABLE_LEVELS.includes(level)}
          />
        ))}
      </div>

      {studyPlan ? (
        <StudyPlanCard plan={studyPlan} />
      ) : (
        <Card>
          <CardContent>
            <p className="text-navy-600">
              {targetLevel && !AVAILABLE_LEVELS.includes(targetLevel)
                ? `Content voor ${LEVEL_LABELS[targetLevel]} is nog in ontwikkeling. Je kunt je doel later aanpassen zodra dit niveau beschikbaar is.`
                : "We stellen je studieplan samen zodra er content beschikbaar is."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
