import { getAdminDashboardStats } from "@/lib/admin/dashboard";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { LEVEL_LABELS, LEVEL_CODES } from "@/types/content";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1">
        <CardDescription>{label}</CardDescription>
        <p className="text-3xl font-bold text-navy-900">{value}</p>
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
        <p className="text-navy-500">Overzicht van gebruikers en content.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Gebruikers totaal" value={stats.totalUsers} />
        <StatCard label="Actieve toegang" value={stats.usersByStatus.active} />
        <StatCard label="In afwachting" value={stats.usersByStatus.pending} />
        <StatCard label="Geblokkeerd" value={stats.usersByStatus.blocked} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Lessen totaal" value={stats.totalLessons} />
        <StatCard label="Oefeningen totaal" value={stats.totalExercises} />
        <StatCard label="KNM-hoofdstukken" value={stats.totalKnmTopics} />
        <StatCard label="Proefexamens" value={stats.totalMockExams} />
      </div>

      <Card>
        <CardContent>
          <CardTitle className="mb-3 text-base">Lessen per niveau</CardTitle>
          <div className="flex flex-wrap gap-3">
            {LEVEL_CODES.map((level) => (
              <div
                key={level}
                className="flex items-center gap-2 rounded-lg border border-navy-100 px-3 py-2"
              >
                <span className="text-sm font-medium text-navy-700">{LEVEL_LABELS[level]}</span>
                <span className="rounded-full bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-600">
                  {stats.lessonsByLevel[level] ?? 0} lessen
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
